# 09 - Intelligence API Contract

The existing JSON schema must be perfectly preserved to maintain frontend compatibility. 

## Unchanged Keys
- `company_summary`
- `market_performance`
- `technical_analysis`
- `sentiment_analysis`
- `prediction_insight` (Text will change to Scenario Projection)
- `risk_factors` (Will now include structured Risk Engine outputs)
- `final_analysis_summary` (Will now include explicitly generated evidence & conflict text)
- `data_source_list`
- `limitations`
- `_meta`

No changes to the frontend code are necessary to support this intelligence upgrade, as the improvements are purely in the textual context and logical weighting provided to these keys.