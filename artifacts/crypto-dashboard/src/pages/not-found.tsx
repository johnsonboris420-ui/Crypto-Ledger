import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[80vh] text-center animate-in">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6 border border-destructive/20 shadow-[0_0_30px_rgba(225,29,72,0.15)]">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-5xl font-display font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist on this node of the blockchain.
        </p>
        
        <Link 
          href="/"
          className="flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,163,255,0.4)] transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Dashboard
        </Link>
      </div>
    </Layout>
  );
}
