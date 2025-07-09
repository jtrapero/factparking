'use client';

import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ExcelToolsProps {
  storageKey: string;
  fileName: string;
}

export default function ExcelTools({ storageKey, fileName }: ExcelToolsProps) {
  const [data, setData] = useState<any[]>([]);
  const [importedData, setImportedData] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, [storageKey]);

  // Guardar datos en localStorage al cambiar
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data, storageKey]);

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setImportedData(jsonData);
      setShowModal(true);
    };
    reader.readAsBinaryString(file);
  };

  const confirmImport = () => {
    setData(importedData);
    setShowModal(false);
  };

  return (
    <>
      <div className="flex gap-4 mt-4">
        <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
          Exportar a Excel
        </Button>
        <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700">
          Importar desde Excel
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar importación</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-600 mb-4">
            Se encontraron <strong>{importedData.length}</strong> registros en el archivo Excel.
            ¿Deseas reemplazar los datos actuales?
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={confirmImport}>
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
