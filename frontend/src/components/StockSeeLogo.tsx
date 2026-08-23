
export default function StockSeeLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img src="/stocksee-logo.png" alt="STOCKSEE" className="h-14 w-auto object-contain drop-shadow-lg" />
    </div>
  );
}
