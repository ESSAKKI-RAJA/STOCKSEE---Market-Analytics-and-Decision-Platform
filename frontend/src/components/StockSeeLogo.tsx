import stocksenseLogo from "@/assets/stocksense-logo.png";

export default function StockSeeLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={stocksenseLogo} alt="STOCKSEE" className="h-8 w-auto object-contain drop-shadow-lg" />
    </div>
  );
}
