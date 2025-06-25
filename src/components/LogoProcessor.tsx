
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { removeBackground, loadImage } from "@/utils/backgroundRemoval";
import { Scissors, Download, Upload } from "lucide-react";

const LogoProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const processCurrentLogo = async () => {
    setIsProcessing(true);
    try {
      toast.info("Iniciando remoção do fundo da logo...");
      
      // Load the current logo
      const response = await fetch('/lovable-uploads/42302101-d256-41da-9c8a-4d0fb8cdf5d2.png');
      const blob = await response.blob();
      const image = await loadImage(blob);
      
      // Remove background
      const processedBlob = await removeBackground(image);
      const processedUrl = URL.createObjectURL(processedBlob);
      
      setProcessedImage(processedUrl);
      toast.success("Fundo removido com sucesso!");
    } catch (error) {
      console.error('Error processing logo:', error);
      toast.error("Erro ao remover o fundo da logo");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadProcessedImage = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'j-barbearia-logo-sem-fundo.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Logo baixada com sucesso!");
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Scissors className="h-5 w-5 text-primary" />
          Processar Logo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <img 
            src="/lovable-uploads/42302101-d256-41da-9c8a-4d0fb8cdf5d2.png" 
            alt="Logo Original" 
            className="h-24 w-24 object-contain mx-auto mb-4 border rounded"
          />
          <p className="text-sm text-gray-600 mb-4">Logo atual da J Barbearia</p>
        </div>

        <Button 
          onClick={processCurrentLogo} 
          disabled={isProcessing}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isProcessing ? (
            "Removendo fundo..."
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Remover Fundo
            </>
          )}
        </Button>

        {processedImage && (
          <div className="space-y-4">
            <div className="text-center">
              <img 
                src={processedImage} 
                alt="Logo Processada" 
                className="h-24 w-24 object-contain mx-auto border rounded bg-gray-100"
              />
              <p className="text-sm text-gray-600 mt-2">Logo sem fundo</p>
            </div>
            
            <Button 
              onClick={downloadProcessedImage}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar Logo Processada
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LogoProcessor;
