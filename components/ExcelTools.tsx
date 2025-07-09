'use client';

import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Download, FileSpreadsheet, AlertTriangle, CheckCircle } from "lucide-react";

interface ExcelToolsProps {
  storageKey: string;
  fileName: string;
}

export default function ExcelTools({ storageKey, fileName }: ExcelToolsProps) {
  const [data, setData] = useState<any[]>([]);
  const [importedData, setImportedData] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(storageKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setData(Array.isArray(parsedData) ? parsedData : []);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setData([]);
    }
  }, [storageKey]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (!data || data.length === 0) {
        alert('No hay datos para exportar');
        return;
      }

      // Crear hoja de cálculo
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
      
      // Generar archivo Excel
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      
      // Descargar archivo con timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      saveAs(blob, `${fileName}_${timestamp}.xlsx`);
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error al exportar a Excel. Por favor, inténtelo de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (Array.isArray(jsonData) && jsonData.length > 0) {
          setImportedData(jsonData);
          setShowModal(true);
        } else {
          alert('El archivo Excel está vacío o no contiene datos válidos');
        }
      } catch (error) {
        console.error('Error reading Excel file:', error);
        alert('Error al leer el archivo Excel. Asegúrese de que sea un archivo válido.');
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.onerror = () => {
      setIsImporting(false);
      alert('Error al leer el archivo');
    };
    
    reader.readAsBinaryString(file);
  };

  const confirmImport = () => {
    try {
      // Validar que los datos importados tengan la estructura correcta
      if (!Array.isArray(importedData) || importedData.length === 0) {
        alert('Los datos importados no son válidos');
        return;
      }

      // Agregar IDs únicos si no los tienen
      const dataWithIds = importedData.map((item, index) => ({
        ...item,
        id: item.id || `imported_${Date.now()}_${index}`
      }));

      // Guardar en localStorage
      localStorage.setItem(storageKey, JSON.stringify(dataWithIds));
      setData(dataWithIds);
      setShowModal(false);
      
      // Recargar la página para reflejar los cambios
      window.location.reload();
      
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Error al importar los datos');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="flex gap-2">
        <Button 
          onClick={handleExport} 
          disabled={isExporting || data.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          {isExporting ? (
            <>
              <FileSpreadsheet className="h-4 w-4 mr-2 animate-pulse" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleImportClick}
          disabled={isImporting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          {isImporting ? (
            <>
              <FileSpreadsheet className="h-4 w-4 mr-2 animate-pulse" />
              Importando...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Importar Excel
            </>
          )}
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirmar importación
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Se encontraron <strong>{importedData.length}</strong> registros en el archivo Excel.
            </div>
            
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <strong>Atención:</strong> Esta acción reemplazará todos los datos actuales con los datos del archivo Excel.
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              Los datos actuales se perderán permanentemente. Asegúrese de haber exportado una copia de seguridad si es necesario.
            </div>
          </div>
          
          <div className="flex gap-2 justify-end mt-6">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={confirmImport}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Confirmar Importación
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}