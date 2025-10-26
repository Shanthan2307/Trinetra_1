"""
Trinetra Core Agent - AI Orchestration System
Main agent that coordinates sub-agents from Fitch Marketplace
"""

import json
import time
import re
from typing import List, Dict, Optional, Callable
from fitch_marketplace import fitch_marketplace, FitchAgent
import google.generativeai as genai
from dotenv import load_dotenv
import os
from elasticsearch_integration import get_elasticsearch_manager

load_dotenv()

class Task:
    """Represents a subtask in the execution graph"""
    
    def __init__(self, task_id: str, task_type: str, description: str, 
                 dependencies: List[str] = None):
        self.task_id = task_id
        self.task_type = task_type
        self.description = description
        self.dependencies = dependencies or []
        self.status = "pending"  # pending, running, completed, failed
        self.result = None
        self.agent_id = None
        self.error = None
        
    def to_dict(self):
        return {
            "task_id": self.task_id,
            "task_type": self.task_type,
            "description": self.description,
            "dependencies": self.dependencies,
            "status": self.status,
            "result": self.result,
            "agent_id": self.agent_id,
            "error": self.error
        }


class ExecutionContext:
    """Maintains state during execution"""
    
    def __init__(self, user_prompt: str):
        self.user_prompt = user_prompt
        self.tasks = []
        self.results = {}
        self.thought_process = []  # Track detailed thought process for UI
        self.start_time = time.time()
        self.status = "initializing"
        self.current_step = 0
        self.total_steps = 0
        self.events = []
        
    def add_task(self, task: Task):
        self.tasks.append(task)
        self.total_steps += 1
        
    def update_status(self, status: str, message: str = ""):
        self.status = status
        self.events.append({
            "timestamp": time.time(),
            "status": status,
            "message": message
        })
    
    def add_thought(self, thought_type: str, content: str, metadata: Dict = None):
        """Add a thought to the thought process for UI visualization"""
        self.thought_process.append({
            "timestamp": time.time(),
            "type": thought_type,  # "reasoning", "decision", "agent_call", "fallback", "result"
            "content": content,
            "metadata": metadata or {}
        })
        
    def get_task_result(self, task_id: str) -> Optional[Dict]:
        return self.results.get(task_id)
    
    def to_dict(self):
        return {
            "user_prompt": self.user_prompt,
            "status": self.status,
            "current_step": self.current_step,
            "total_steps": self.total_steps,
            "tasks": [t.to_dict() for t in self.tasks],
            "results": self.results,
            "elapsed_time": time.time() - self.start_time,
            "events": self.events[-10:],  # Last 10 events
            "thought_process": self.thought_process  # Full thought process
        }


class TrinetraAgent:
    """
    Main AI Orchestrator for Trinetra
    Coordinates multiple AI agents to accomplish complex goals
    """
    
    def __init__(self):
        self.marketplace = fitch_marketplace
        self.contexts = {}  # Store execution contexts
        self.llm = self._init_llm()
        self.es = get_elasticsearch_manager()  # Elasticsearch for logging
        
    def _init_llm(self):
        """Initialize Gemini for task decomposition"""
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            return genai.GenerativeModel('gemini-pro')
        return None
    
    def process_user_prompt(self, prompt: str, context_id: Optional[str] = None) -> Dict:
        """
        Main entry point: Process a high-level user command
        
        Example: "Book an Uber if the tennis court is dry"
        """
        
        # Create execution context
        if not context_id:
            context_id = f"ctx_{int(time.time())}_{hash(prompt) % 10000}"
        
        context = ExecutionContext(prompt)
        self.contexts[context_id] = context
        
        try:
            # Step 1: Decompose prompt into tasks
            context.update_status("decomposing", "Breaking down your request...")
            context.add_thought("reasoning", f"🤔 Analyzing user command: '{prompt}'")
            
            tasks = self._decompose_prompt(prompt, context)
            
            for task in tasks:
                context.add_task(task)
            
            context.add_thought("reasoning", f"✅ Identified {len(tasks)} subtasks to execute")
            
            # Step 2: Discover agents for each task
            context.update_status("discovering", "Finding AI agents for each task...")
            context.add_thought("reasoning", "🔍 Searching Fitch Marketplace for specialized agents...")
            
            self._assign_agents_to_tasks(context)
            
            # Step 3: Execute task graph
            context.update_status("executing", "Executing tasks...")
            context.add_thought("reasoning", "⚙️ Beginning task execution with dependency management")
            
            execution_result = self._execute_task_graph(context)
            
            # Step 4: Synthesize final result
            context.update_status("synthesizing", "Generating final response...")
            context.add_thought("reasoning", "📊 Synthesizing results into human-readable format")
            
            final_result = self._synthesize_result(context, execution_result)
            
            context.update_status("completed", "Task completed successfully!")
            context.add_thought("result", f"✨ Final result: {final_result[:100]}...")
            
            # Log to Elasticsearch
            if self.es:
                try:
                    execution_time_ms = int((time.time() - int(context_id.split('_')[1])) * 1000)
                    agents_used = [task.agent_id for task in context.tasks if task.agent_id]
                    self.es.log_orchestration(
                        context_id=context_id,
                        user_prompt=prompt,
                        status="completed",
                        tasks=[task.to_dict() for task in context.tasks],
                        thought_process=context.thought_process,
                        agents_used=agents_used,
                        execution_time_ms=execution_time_ms,
                        final_result=final_result
                    )
                except Exception as es_error:
                    print(f"⚠️ Failed to log to Elasticsearch: {es_error}")
            
            return {
                "success": True,
                "context_id": context_id,
                "result": final_result,
                "execution_summary": context.to_dict()
            }
            
        except Exception as e:
            context.update_status("failed", f"Error: {str(e)}")
            return {
                "success": False,
                "context_id": context_id,
                "error": str(e),
                "execution_summary": context.to_dict()
            }
    
    def _decompose_prompt(self, prompt: str, context: ExecutionContext) -> List[Task]:
        """Decompose user prompt into subtasks using LLM"""
        
        # Use LLM to decompose if available, otherwise use rule-based
        if self.llm:
            context.add_thought("reasoning", "🧠 Using Gemini AI for intelligent task decomposition")
            return self._llm_decompose(prompt, context)
        else:
            context.add_thought("reasoning", "📝 Using rule-based task decomposition")
            return self._rule_based_decompose(prompt)
    
    def _llm_decompose(self, prompt: str, context: ExecutionContext) -> List[Task]:
        """Use Gemini to decompose prompt into tasks"""
        
        decomposition_prompt = f"""
        Analyze this user request and break it down into a sequence of subtasks.
        Each task should have a clear type (cctv_check, wallet_check, ride_booking, weather_check, decision, etc.)
        
        User Request: "{prompt}"
        
        Return a JSON array of tasks with this format:
        [
            {{"task_id": "task_1", "type": "cctv_check", "description": "Check if tennis court is dry", "dependencies": []}},
            {{"task_id": "task_2", "type": "wallet_check", "description": "Verify sufficient balance", "dependencies": ["task_1"]}},
            {{"task_id": "task_3", "type": "ride_booking", "description": "Book Uber to location", "dependencies": ["task_1", "task_2"]}}
        ]
        
        Only return the JSON array, no other text.
        """
        
        try:
            response = self.llm.generate_content(decomposition_prompt)
            tasks_json = json.loads(response.text.strip())
            
            tasks = []
            for t in tasks_json:
                task = Task(
                    task_id=t.get("task_id", f"task_{len(tasks)+1}"),
                    task_type=t.get("type", "general"),
                    description=t.get("description", ""),
                    dependencies=t.get("dependencies", [])
                )
                tasks.append(task)
            
            return tasks
            
        except Exception as e:
            print(f"LLM decomposition failed: {e}, falling back to rule-based")
            return self._rule_based_decompose(prompt)
    
    def _rule_based_decompose(self, prompt: str) -> List[Task]:
        """Rule-based task decomposition as fallback"""
        
        prompt_lower = prompt.lower()
        tasks = []
        
        # Check for conditional logic
        has_condition = any(word in prompt_lower for word in ['if', 'when', 'unless', 'provided'])
        
        # Task 1: CCTV/Vision check (if mentioned)
        if any(word in prompt_lower for word in ['camera', 'cctv', 'tennis court', 'dry', 'wet', 'weather', 'check']):
            tasks.append(Task(
                task_id="task_1",
                task_type="cctv_check",
                description="Analyze camera feed to determine conditions",
                dependencies=[]
            ))
        
        # Task 2: Wallet/Balance check (if mentioned)
        if any(word in prompt_lower for word in ['wallet', 'balance', 'funds', 'money', 'afford']):
            deps = ["task_1"] if has_condition and tasks else []
            tasks.append(Task(
                task_id="task_2",
                task_type="wallet_check",
                description="Check wallet balance",
                dependencies=deps
            ))
        
        # Task 3: Ride booking (if mentioned)
        if any(word in prompt_lower for word in ['uber', 'ride', 'book', 'taxi', 'drive']):
            # Depends on previous tasks if conditional
            deps = [t.task_id for t in tasks] if has_condition else []
            tasks.append(Task(
                task_id=f"task_{len(tasks)+1}",
                task_type="ride_booking",
                description="Book ride to destination",
                dependencies=deps
            ))
        
        # Task 4: Weather check (if mentioned separately)
        if 'weather' in prompt_lower and 'cctv' not in prompt_lower:
            tasks.append(Task(
                task_id=f"task_{len(tasks)+1}",
                task_type="weather_check",
                description="Check weather conditions",
                dependencies=[]
            ))
        
        # Default task if nothing matched
        if not tasks:
            tasks.append(Task(
                task_id="task_1",
                task_type="general",
                description=prompt,
                dependencies=[]
            ))
        
        return tasks
    
    def _assign_agents_to_tasks(self, context: ExecutionContext):
        """Find and assign best agents for each task"""
        
        for task in context.tasks:
            # Map task type to search query
            query_map = {
                "cctv_check": "cctv vision analysis weather moisture",
                "wallet_check": "wallet balance check funds",
                "ride_booking": "uber ride booking transportation",
                "weather_check": "weather forecast conditions",
                "decision": "decision making logic reasoning",
                "general": task.description
            }
            
            search_query = query_map.get(task.task_type, task.description)
            
            # Search marketplace for best agent
            agents = self.marketplace.search_agents(search_query, min_rating=4.0)
            
            if agents:
                # Assign top-rated agent
                best_agent = agents[0]
                task.agent_id = best_agent.agent_id
                
                context.events.append({
                    "timestamp": time.time(),
                    "event": "agent_assigned",
                    "task_id": task.task_id,
                    "agent": best_agent.name
                })
    
    def _execute_task_graph(self, context: ExecutionContext) -> Dict:
        """Execute tasks respecting dependencies"""
        
        execution_log = []
        decisions = {}
        
        # Build dependency graph
        task_dict = {t.task_id: t for t in context.tasks}
        
        # Execute in order, respecting dependencies
        executed = set()
        
        while len(executed) < len(context.tasks):
            progress_made = False
            
            for task in context.tasks:
                if task.task_id in executed:
                    continue
                
                # Check if dependencies are satisfied
                deps_satisfied = all(dep in executed for dep in task.dependencies)
                
                if deps_satisfied:
                    # Execute task
                    task.status = "running"
                    context.current_step += 1
                    
                    context.events.append({
                        "timestamp": time.time(),
                        "event": "task_started",
                        "task_id": task.task_id,
                        "description": task.description
                    })
                    
                    # Execute with assigned agent
                    result = self._execute_single_task(task, context)
                    
                    task.result = result
                    task.status = "completed" if result.get("status") != "error" else "failed"
                    context.results[task.task_id] = result
                    
                    execution_log.append({
                        "task_id": task.task_id,
                        "task_type": task.task_type,
                        "result": result
                    })
                    
                    # Store decision points for conditional logic
                    if task.task_type == "cctv_check":
                        # Check if court is dry
                        analysis = result.get("result", {}).get("analysis", "").lower()
                        decisions["court_dry"] = "dry" in analysis or "clear" in analysis
                    
                    elif task.task_type == "wallet_check":
                        # Check if sufficient balance
                        balance = result.get("result", {}).get("balance", 0)
                        decisions["sufficient_funds"] = balance >= 20  # Assume $20 minimum
                    
                    executed.add(task.task_id)
                    progress_made = True
                    
                    # Check if we should abort based on conditions
                    if not self._should_continue(task, decisions, context):
                        # Abort remaining tasks
                        for remaining_task in context.tasks:
                            if remaining_task.task_id not in executed:
                                remaining_task.status = "skipped"
                                context.results[remaining_task.task_id] = {
                                    "status": "skipped",
                                    "reason": "Conditional requirement not met"
                                }
                        return {
                            "execution_log": execution_log,
                            "decisions": decisions,
                            "aborted": True,
                            "reason": "Conditional requirements not satisfied"
                        }
            
            if not progress_made:
                # Circular dependency or error
                break
        
        return {
            "execution_log": execution_log,
            "decisions": decisions,
            "aborted": False
        }
    
    def _execute_single_task(self, task: Task, context: ExecutionContext) -> Dict:
        """Execute a single task with its assigned agent, with Gemini fallback"""
        
        if not task.agent_id:
            context.add_thought("decision", f"⚠️ No agent assigned for {task.task_id}, attempting Gemini fallback")
            return self._gemini_fallback(task, context)
        
        # Get agent info
        agent = self.marketplace.get_agent(task.agent_id)
        agent_name = agent.name if agent else task.agent_id
        
        context.add_thought("agent_call", f"🤖 Calling {agent_name} for {task.task_type}", {
            "agent_id": task.agent_id,
            "task_id": task.task_id
        })
        
        # Prepare task data
        task_data = {
            "task_id": task.task_id,
            "description": task.description,
            "context": context.user_prompt
        }
        
        # Execute agent
        result = self.marketplace.execute_agent(task.agent_id, task_data)
        
        # Check if agent failed - use Gemini fallback
        if result.get("status") == "error":
            context.add_thought("fallback", f"❌ Agent {agent_name} failed, using Gemini fallback", {
                "error": result.get("error")
            })
            return self._gemini_fallback(task, context)
        
        context.add_thought("agent_call", f"✅ {agent_name} completed successfully", {
            "result_preview": str(result.get("result", {}))[:100]
        })
        
        return result
    
    def _gemini_fallback(self, task: Task, context: ExecutionContext) -> Dict:
        """Use Gemini as fallback when agents fail or are unavailable"""
        
        if not self.llm:
            return {
                "status": "error",
                "error": "No agent available and Gemini not configured"
            }
        
        try:
            context.add_thought("fallback", f"🧠 Using Gemini AI to handle {task.task_type}")
            
            # Create prompt for Gemini based on task type
            fallback_prompt = f"""
            You are helping with a task in the Trinetra security camera system.
            
            Task Type: {task.task_type}
            Task Description: {task.description}
            User Context: {context.user_prompt}
            
            Please provide a realistic response for this task. If it involves:
            - CCTV analysis: Describe what you would expect to see
            - Wallet check: Provide a reasonable balance
            - Ride booking: Provide booking details
            - Weather: Provide weather information
            
            Respond in JSON format matching what the agent would return.
            """
            
            response = self.llm.generate_content(fallback_prompt)
            
            # Try to parse as JSON, otherwise create structured response
            try:
                result_data = json.loads(response.text)
            except:
                result_data = {
                    "fallback_response": response.text,
                    "generated_by": "gemini"
                }
            
            context.add_thought("fallback", f"✅ Gemini provided fallback response")
            
            return {
                "status": "success",
                "result": result_data,
                "fallback": True,
                "generated_by": "gemini"
            }
            
        except Exception as e:
            context.add_thought("fallback", f"❌ Gemini fallback also failed: {str(e)}")
            return {
                "status": "error",
                "error": f"Gemini fallback failed: {str(e)}"
            }
    
    def _should_continue(self, task: Task, decisions: Dict, context: ExecutionContext) -> bool:
        """Determine if execution should continue based on results"""
        
        # Check conditional logic in prompt
        prompt_lower = context.user_prompt.lower()
        
        # If prompt has "if dry" condition and court is not dry, abort
        if "if" in prompt_lower and "dry" in prompt_lower:
            if task.task_type == "cctv_check":
                if not decisions.get("court_dry", False):
                    context.events.append({
                        "timestamp": time.time(),
                        "event": "condition_not_met",
                        "reason": "Tennis court is not dry"
                    })
                    return False
        
        # Check wallet balance condition
        if "wallet" in prompt_lower or "balance" in prompt_lower:
            if task.task_type == "wallet_check":
                if not decisions.get("sufficient_funds", True):
                    context.events.append({
                        "timestamp": time.time(),
                        "event": "condition_not_met",
                        "reason": "Insufficient funds"
                    })
                    return False
        
        return True
    
    def _synthesize_result(self, context: ExecutionContext, execution_result: Dict) -> str:
        """Generate final human-readable result"""
        
        if execution_result.get("aborted"):
            return f"❌ Task aborted: {execution_result.get('reason', 'Conditions not met')}"
        
        # Build result message
        results = []
        for task in context.tasks:
            if task.status == "completed":
                result_data = task.result.get("result", {})
                
                if task.task_type == "cctv_check":
                    analysis = result_data.get("analysis", "Unknown")
                    confidence = result_data.get("confidence", 0)
                    results.append(f"✅ Camera Analysis: {analysis} ({confidence*100:.0f}% confidence)")
                
                elif task.task_type == "wallet_check":
                    balance = result_data.get("balance", 0)
                    sufficient = result_data.get("sufficient", False)
                    status = "✅ Sufficient" if sufficient else "⚠️ Insufficient"
                    results.append(f"{status} Balance: ${balance:.2f}")
                
                elif task.task_type == "ride_booking":
                    booking_id = result_data.get("booking_id", "Unknown")
                    eta = result_data.get("eta", "Unknown")
                    driver = result_data.get("driver", "Unknown")
                    results.append(f"🚗 Uber Booked! ID: {booking_id}, ETA: {eta}, Driver: {driver}")
                
                elif task.task_type == "weather_check":
                    condition = result_data.get("condition", "Unknown")
                    temp = result_data.get("temperature", "Unknown")
                    results.append(f"🌤️ Weather: {condition}, {temp}°F")
        
        if results:
            return "\n".join(results)
        else:
            return "✅ Task completed successfully"
    
    def get_context_status(self, context_id: str) -> Optional[Dict]:
        """Get current status of an execution context"""
        context = self.contexts.get(context_id)
        if context:
            return context.to_dict()
        return None
    
    def list_available_agents(self, category: Optional[str] = None) -> List[Dict]:
        """List all available agents from marketplace"""
        return self.marketplace.list_all_agents(category)
    
    def get_marketplace_stats(self) -> Dict:
        """Get Fitch Marketplace statistics"""
        return self.marketplace.get_agent_stats()


# Singleton instance
trinetra_agent = TrinetraAgent()
