import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

const ETFDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();

  return (
    <div className="w-full h-full p-6 animate-fade-in-up">
      <Helmet>
        <title>{symbol} | ETF Terminal | STOCKSEE</title>
      </Helmet>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{symbol} Terminal</h1>
        <p className="text-muted-foreground">ETF Analytics</p>
      </div>
      <div className="t-panel p-6 border-border/50 text-center text-muted-foreground min-h-[400px] flex items-center justify-center">
        ETF Terminal Details Here
      </div>
    </div>
  );
};

export default ETFDetail;
