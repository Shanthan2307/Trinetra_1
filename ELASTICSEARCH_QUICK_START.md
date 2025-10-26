# ⚡ Elasticsearch Quick Start

## 🚀 Test It Now!

### **1. Verify Connection**
```bash
curl http://localhost:5000/api/elasticsearch/analytics
```

Expected:
```json
{
  "success": true,
  "analytics": {
    "total_cctv_logs": 0,
    "total_ai_analyses": 0,
    "total_transactions": 0,
    "total_orchestrations": 0
  }
}
```

### **2. Run Uber Court Flow**
```
1. Open http://localhost:3000
2. Click [UBER-COURT-FLOW] 🚗
3. Type: "book an Uber if the nearest court is dry"
4. Click [START FLOW]
5. Wait for completion
```

### **3. Check Logs**
```bash
# Get AI analysis logs
curl http://localhost:5000/api/elasticsearch/ai_analysis

# Should show the court analysis with 93% confidence!
```

---

## 📊 View in Elasticsearch Cloud

1. **Login:** https://my-elasticsearch-project-b335c5.es.us-central1.gcp.elastic.cloud
2. **Navigate:** Discover → Select `trinetra-*`
3. **View:** All logs from Trinetra!

---

## 🎯 What's Being Logged

| Action | Index | Trigger |
|--------|-------|---------|
| Add Camera | `trinetra-cctv-footage` | `/api/add_camera` |
| Camera Transaction | `trinetra-transactions` | `/api/add_camera` |
| AI Vision Analysis | `trinetra-ai-analysis` | Uber Court Flow |
| Agent Orchestration | `trinetra-orchestration` | `/api/trinetra/process` |

---

## 🔍 Quick Queries

```bash
# Get all CCTV cameras
curl http://localhost:5000/api/elasticsearch/cctv_logs

# Get high-confidence analyses (>90%)
curl "http://localhost:5000/api/elasticsearch/ai_analysis?min_confidence=0.90"

# Get all transactions
curl http://localhost:5000/api/elasticsearch/transactions

# Get summary
curl http://localhost:5000/api/elasticsearch/analytics
```

---

## ✅ Status

```
✅ Elasticsearch connected
✅ 4 indices created
✅ Auto-logging enabled
✅ API endpoints ready
✅ Frontend integrated
```

**Ready to use!** 🎉
