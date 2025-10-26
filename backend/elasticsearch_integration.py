"""
Elasticsearch Integration for Trinetra AI System
Handles CCTV footage metadata, analysis results, and transaction logs
"""

from elasticsearch import Elasticsearch
from datetime import datetime
import json
import os
from dotenv import load_dotenv

load_dotenv()

class ElasticsearchManager:
    def __init__(self):
        """Initialize Elasticsearch connection"""
        self.cloud_id = os.getenv("ELASTICSEARCH_CLOUD_ID")
        self.api_key = os.getenv("ELASTICSEARCH_API_KEY")
        self.url = os.getenv("ELASTICSEARCH_URL")
        
        if self.cloud_id and self.api_key:
            # Connect using Cloud ID
            self.client = Elasticsearch(
                cloud_id=self.cloud_id,
                api_key=self.api_key
            )
        elif self.url and self.api_key:
            # Connect using URL and API key
            self.client = Elasticsearch(
                self.url,
                api_key=self.api_key,
                verify_certs=True
            )
        else:
            raise ValueError("Elasticsearch credentials not configured")
        
        # Test connection
        if self.client.ping():
            print("✅ Connected to Elasticsearch")
        else:
            print("❌ Failed to connect to Elasticsearch")
        
        # Initialize indices
        self._create_indices()
    
    def _create_indices(self):
        """Create necessary indices if they don't exist"""
        
        # CCTV Footage Index
        cctv_index = "trinetra-cctv-footage"
        if not self.client.indices.exists(index=cctv_index):
            self.client.indices.create(
                index=cctv_index,
                body={
                    "mappings": {
                        "properties": {
                            "camera_id": {"type": "keyword"},
                            "camera_name": {"type": "text"},
                            "location": {"type": "geo_point"},
                            "timestamp": {"type": "date"},
                            "stream_url": {"type": "keyword"},
                            "frame_snapshot_url": {"type": "keyword"},
                            "metadata": {"type": "object"},
                            "blockchain_tx": {"type": "keyword"},
                            "ipfs_cid": {"type": "keyword"}
                        }
                    }
                }
            )
            print(f"✅ Created index: {cctv_index}")
        
        # AI Analysis Results Index
        analysis_index = "trinetra-ai-analysis"
        if not self.client.indices.exists(index=analysis_index):
            self.client.indices.create(
                index=analysis_index,
                body={
                    "mappings": {
                        "properties": {
                            "analysis_id": {"type": "keyword"},
                            "camera_id": {"type": "keyword"},
                            "timestamp": {"type": "date"},
                            "analysis_type": {"type": "keyword"},
                            "result": {"type": "object"},
                            "confidence": {"type": "float"},
                            "agent_id": {"type": "keyword"},
                            "agent_name": {"type": "text"},
                            "processing_time_ms": {"type": "integer"},
                            "gemini_used": {"type": "boolean"},
                            "frames_analyzed": {"type": "integer"},
                            "detected_objects": {"type": "text"},
                            "conditions": {"type": "object"}
                        }
                    }
                }
            )
            print(f"✅ Created index: {analysis_index}")
        
        # Transaction Logs Index
        transaction_index = "trinetra-transactions"
        if not self.client.indices.exists(index=transaction_index):
            self.client.indices.create(
                index=transaction_index,
                body={
                    "mappings": {
                        "properties": {
                            "transaction_id": {"type": "keyword"},
                            "timestamp": {"type": "date"},
                            "transaction_type": {"type": "keyword"},
                            "user_address": {"type": "keyword"},
                            "blockchain": {"type": "keyword"},
                            "tx_hash": {"type": "keyword"},
                            "status": {"type": "keyword"},
                            "details": {"type": "object"},
                            "gas_used": {"type": "long"},
                            "related_camera_id": {"type": "keyword"}
                        }
                    }
                }
            )
            print(f"✅ Created index: {transaction_index}")
        
        # Agent Orchestration Logs Index
        orchestration_index = "trinetra-orchestration"
        if not self.client.indices.exists(index=orchestration_index):
            self.client.indices.create(
                index=orchestration_index,
                body={
                    "mappings": {
                        "properties": {
                            "context_id": {"type": "keyword"},
                            "timestamp": {"type": "date"},
                            "user_prompt": {"type": "text"},
                            "status": {"type": "keyword"},
                            "tasks": {"type": "object"},
                            "thought_process": {"type": "object"},
                            "agents_used": {"type": "keyword"},
                            "execution_time_ms": {"type": "integer"},
                            "final_result": {"type": "text"}
                        }
                    }
                }
            )
            print(f"✅ Created index: {orchestration_index}")
    
    def log_cctv_footage(self, camera_id, camera_name, location, stream_url, 
                         frame_snapshot_url=None, metadata=None, tx_hash=None, ipfs_cid=None):
        """Log CCTV footage metadata"""
        doc = {
            "camera_id": camera_id,
            "camera_name": camera_name,
            "location": location,
            "timestamp": datetime.utcnow().isoformat(),
            "stream_url": stream_url,
            "frame_snapshot_url": frame_snapshot_url,
            "metadata": metadata or {},
            "blockchain_tx": tx_hash,
            "ipfs_cid": ipfs_cid
        }
        
        result = self.client.index(index="trinetra-cctv-footage", document=doc)
        return result['_id']
    
    def log_ai_analysis(self, camera_id, analysis_type, result, confidence, 
                       agent_id, agent_name, processing_time_ms, 
                       gemini_used=False, frames_analyzed=0, 
                       detected_objects=None, conditions=None):
        """Log AI analysis results"""
        doc = {
            "analysis_id": f"analysis-{datetime.utcnow().timestamp()}",
            "camera_id": camera_id,
            "timestamp": datetime.utcnow().isoformat(),
            "analysis_type": analysis_type,
            "result": result,
            "confidence": confidence,
            "agent_id": agent_id,
            "agent_name": agent_name,
            "processing_time_ms": processing_time_ms,
            "gemini_used": gemini_used,
            "frames_analyzed": frames_analyzed,
            "detected_objects": detected_objects or [],
            "conditions": conditions or {}
        }
        
        result = self.client.index(index="trinetra-ai-analysis", document=doc)
        return result['_id']
    
    def log_transaction(self, transaction_type, user_address, blockchain, 
                       tx_hash, status, details=None, gas_used=None, 
                       related_camera_id=None):
        """Log blockchain transaction"""
        doc = {
            "transaction_id": f"tx-{datetime.utcnow().timestamp()}",
            "timestamp": datetime.utcnow().isoformat(),
            "transaction_type": transaction_type,
            "user_address": user_address,
            "blockchain": blockchain,
            "tx_hash": tx_hash,
            "status": status,
            "details": details or {},
            "gas_used": gas_used,
            "related_camera_id": related_camera_id
        }
        
        result = self.client.index(index="trinetra-transactions", document=doc)
        return result['_id']
    
    def log_orchestration(self, context_id, user_prompt, status, tasks, 
                         thought_process, agents_used, execution_time_ms, 
                         final_result):
        """Log AI orchestration execution"""
        doc = {
            "context_id": context_id,
            "timestamp": datetime.utcnow().isoformat(),
            "user_prompt": user_prompt,
            "status": status,
            "tasks": tasks,
            "thought_process": thought_process,
            "agents_used": agents_used,
            "execution_time_ms": execution_time_ms,
            "final_result": final_result
        }
        
        result = self.client.index(index="trinetra-orchestration", document=doc)
        return result['_id']
    
    def search_cctv_footage(self, camera_id=None, start_time=None, end_time=None, limit=100):
        """Search CCTV footage logs"""
        query = {"bool": {"must": []}}
        
        if camera_id:
            query["bool"]["must"].append({"term": {"camera_id": camera_id}})
        
        if start_time or end_time:
            range_query = {"range": {"timestamp": {}}}
            if start_time:
                range_query["range"]["timestamp"]["gte"] = start_time
            if end_time:
                range_query["range"]["timestamp"]["lte"] = end_time
            query["bool"]["must"].append(range_query)
        
        result = self.client.search(
            index="trinetra-cctv-footage",
            query=query if query["bool"]["must"] else {"match_all": {}},
            size=limit,
            sort=[{"timestamp": {"order": "desc"}}]
        )
        
        return [hit["_source"] for hit in result["hits"]["hits"]]
    
    def search_ai_analysis(self, camera_id=None, analysis_type=None, 
                          min_confidence=None, limit=100):
        """Search AI analysis results"""
        query = {"bool": {"must": []}}
        
        if camera_id:
            query["bool"]["must"].append({"term": {"camera_id": camera_id}})
        
        if analysis_type:
            query["bool"]["must"].append({"term": {"analysis_type": analysis_type}})
        
        if min_confidence:
            query["bool"]["must"].append({"range": {"confidence": {"gte": min_confidence}}})
        
        result = self.client.search(
            index="trinetra-ai-analysis",
            query=query if query["bool"]["must"] else {"match_all": {}},
            size=limit,
            sort=[{"timestamp": {"order": "desc"}}]
        )
        
        return [hit["_source"] for hit in result["hits"]["hits"]]
    
    def search_transactions(self, user_address=None, tx_hash=None, 
                           transaction_type=None, limit=100):
        """Search transaction logs"""
        query = {"bool": {"must": []}}
        
        if user_address:
            query["bool"]["must"].append({"term": {"user_address": user_address}})
        
        if tx_hash:
            query["bool"]["must"].append({"term": {"tx_hash": tx_hash}})
        
        if transaction_type:
            query["bool"]["must"].append({"term": {"transaction_type": transaction_type}})
        
        result = self.client.search(
            index="trinetra-transactions",
            query=query if query["bool"]["must"] else {"match_all": {}},
            size=limit,
            sort=[{"timestamp": {"order": "desc"}}]
        )
        
        return [hit["_source"] for hit in result["hits"]["hits"]]
    
    def get_analytics_summary(self):
        """Get analytics summary across all indices"""
        cctv_count = self.client.count(index="trinetra-cctv-footage")["count"]
        analysis_count = self.client.count(index="trinetra-ai-analysis")["count"]
        transaction_count = self.client.count(index="trinetra-transactions")["count"]
        orchestration_count = self.client.count(index="trinetra-orchestration")["count"]
        
        return {
            "total_cctv_logs": cctv_count,
            "total_ai_analyses": analysis_count,
            "total_transactions": transaction_count,
            "total_orchestrations": orchestration_count,
            "timestamp": datetime.utcnow().isoformat()
        }

# Singleton instance
_es_manager = None

def get_elasticsearch_manager():
    """Get or create Elasticsearch manager instance"""
    global _es_manager
    if _es_manager is None:
        try:
            _es_manager = ElasticsearchManager()
        except Exception as e:
            print(f"⚠️ Elasticsearch not configured: {e}")
            _es_manager = None
    return _es_manager
