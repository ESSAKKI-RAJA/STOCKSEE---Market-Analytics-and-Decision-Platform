# 13 - Performance Baseline

## Batch Endpoint Stress Test
- **1 Symbol**: ~1.8s (Miss) -> ~0.05s (Hit)
- **10 Symbols**: ~15-20s (Miss, Sequential) -> ~0.2s (Hit)
- **Conclusion**: The batch endpoint relies heavily on the `DecisionSnapshot` populating the cache first. If a user adds 10 new un-analyzed stocks, the initial load is slow but safe.