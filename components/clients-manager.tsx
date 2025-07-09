// components/clients-manager.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { AddressAutocomplete } from "@/components/address-autocomplete";
import ExcelTools from "@/components/ExcelTools"; // Asegúrate de que esta importación esté presente y con la capitalización correcta

interface Client {
  // ... (tu interfaz Client)
}

const INITIAL_CLIENTS: Client[] = [
  // ... (tu array INITIAL_CLIENTS)
];

export default function ClientsManager() { // <-- ¡SOLO ESTA EXPORTACIÓN POR DEFECTO EN ESTE ARCHIVO!
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getInitialFormData = () => ({
    nombre: "",
    apellidos: "",
    cifNif: "",
    direccion: "",
    cp: "",
    ciudad: "",
    sociedadId: "PARKING001",
  });

  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    try {
      const stored = localStorage.getItem("parking-clients");
      if (stored) {
        setData(JSON.parse(stored)); // <-- Aquí debería ser setClients, no setData
      } else {
        setClients(INITIAL_CLIENTS);
        localStorage.setItem("parking-clients", JSON.stringify(INITIAL_CLIENTS));
      }
    } catch (error) {
      console.error("Error loading clients:", error);
      setClients(INITIAL_CLIENTS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveClients = (newClients: Client[]) => {
    setClients(newClients);
    localStorage.setItem("parking-clients", JSON.stringify(newClients));
  };

  const filteredClients = clients.filter(
    (client) =>
      client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cifNif.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingClient) {
      const updatedClients = clients.map((client) =>
        client.id === editingClient.id ? { ...formData, id: editingClient.id } : client,
      );
      saveClients(updatedClients);
    } else {
      const newClient: Client = {
        ...formData,
        id: Date.now().toString(),
      };
      saveClients([...clients, newClient]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
    setEditingClient(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      nombre: client.nombre || "",
      apellidos: client.apellidos || "",
      cifNif: client.cifNif || "",
      direccion: client.direccion || "",
      cp: client.cp || "",
      ciudad: client.ciudad || "",
      sociedadId: client.sociedadId || "PARKING001",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar este cliente?")) {
      const updatedClients = clients.filter((client) => client.id !== id);
      saveClients(updatedClients);
    }
  };

  const handleAddressSelect = (address: { direccion: string; cp: string; ciudad: string }) => {
    setFormData((prev) => ({
      ...prev,
      direccion: address.direccion,
      cp: address.cp,
      ciudad: address.ciudad,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Clientes</CardTitle>
        <CardDescription>
          Administre la base de datos de clientes del parking ({clients.length} clientes registrados)
          <br />
          <span className="text-sm text-blue-600 mt-1 block">
            💡 El autocompletado de direcciones rellena automáticamente CP y ciudad
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingClient(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingClient ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
                <DialogDescription>Complete los datos del cliente</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="apellidos">Apellidos</Label>
                    <Input
                      id="apellidos"
                      value={formData.apellidos}
                      onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cifNif">CIF/NIF</Label>
                  <Input
                    id="cifNif"
                    value={formData.cifNif}
                    onChange={(e) => setFormData({ ...formData, cifNif: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <AddressAutocomplete onAddressSelect={handleAddressSelect} initialValue={formData.direccion} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cp">Código Postal</Label>
                    <Input
                      id="cp"
                      value={formData.cp}
                      onChange={(e) => setFormData({ ...formData, cp: e.target.value })}
                      required
                      className="bg-blue-50"
                      placeholder="Se rellena automáticamente"
                    />
                    <p className="text-xs text-blue-600 mt-1">✨ Se completa automáticamente</p>
                  </div>
                  <div>
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input
                      id="ciudad"
                      value={formData.ciudad}
                      onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                      required
                      className="bg-blue-50"
                      placeholder="Se rellena automáticamente"
                    />
                    <p className="text-xs text-blue-600 mt-1">✨ Se completa automáticamente</p>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">{editingClient ? "Actualizar" : "Crear"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Agrega el componente ExcelTools aquí para clientes */}
        <div className="flex justify-end">
          <ExcelTools storageKey="parking-clients" fileName="clientes" />
        </div>

        {!isLoaded ? (
          <div className="border rounded-lg p-8 text-center">
            <p className="text-gray-500">Cargando datos...</p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>CIF/NIF</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>CP</TableHead>
                  <TableHead>Ciudad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.nombre} {client.apellidos}
                    </TableCell>
                    <TableCell className="font-mono">{client.cifNif}</TableCell>
                    <TableCell>{client.direccion || "-"}</TableCell>
                    <TableCell>{client.cp}</TableCell>
                    <TableCell>{client.ciudad}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(client)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(client.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredClients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No se encontraron clientes
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
