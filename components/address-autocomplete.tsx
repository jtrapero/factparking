"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin, Check, Globe, Building, Database, Map } from "lucide-react"

interface AddressResult {
  street: string
  postalCode: string
  city: string
  province: string
  fullAddress: string
  source: string
}

interface AddressAutocompleteProps {
  onAddressSelect: (address: {
    direccion: string
    cp: string
    ciudad: string
  }) => void
  initialValue?: string
  disabled?: boolean
}

export function AddressAutocomplete({
  onAddressSelect,
  initialValue = "",
  disabled = false,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(initialValue)
  const [suggestions, setSuggestions] = useState<AddressResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [apiInfo, setApiInfo] = useState<any>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const searchAddresses = async () => {
      if (query.length < 3) {
        setSuggestions([])
        setShowSuggestions(false)
        setApiInfo(null)
        return
      }

      // Cancelar búsqueda anterior
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()
      setIsLoading(true)

      try {
        console.log("🚀 Buscando direcciones para:", query)

        const response = await fetch(`/api/address-search?q=${encodeURIComponent(query)}`, {
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("✅ Respuesta de API:", data)

        if (data.success) {
          setSuggestions(data.results || [])
          setApiInfo(data.sources)
          setShowSuggestions(data.results?.length > 0)
          setSelectedIndex(-1)
        } else {
          console.error("❌ Error en API:", data.error)
          setSuggestions([])
          setShowSuggestions(false)
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("❌ Error en búsqueda:", error)
          setSuggestions([])
          setShowSuggestions(false)
        }
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchAddresses, 300) // Más rápido
    return () => {
      clearTimeout(debounceTimer)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [query])

  const handleInputChange = (value: string) => {
    setQuery(value)
  }

  const handleSuggestionClick = (address: AddressResult) => {
    console.log("✅ Dirección seleccionada:", address)
    setQuery(address.street)
    setShowSuggestions(false)

    onAddressSelect({
      direccion: address.street,
      cp: address.postalCode,
      ciudad: address.city,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex])
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }, 200)
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "Local":
        return <Database className="h-3 w-3 text-green-600" />
      case "Nominatim":
        return <Globe className="h-3 w-3 text-blue-500" />
      case "Photon":
        return <Map className="h-3 w-3 text-purple-500" />
      case "MapBox":
        return <MapPin className="h-3 w-3 text-orange-500" />
      case "CartoCiudad":
        return <Building className="h-3 w-3 text-green-500" />
      default:
        return <MapPin className="h-3 w-3 text-gray-500" />
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case "Local":
        return "text-green-600 bg-green-50"
      case "Nominatim":
        return "text-blue-600 bg-blue-50"
      case "Photon":
        return "text-purple-600 bg-purple-50"
      case "MapBox":
        return "text-orange-600 bg-orange-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="relative">
      <Label htmlFor="direccion">Dirección</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="direccion"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => query.length >= 3 && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Ej: Calle Lisboa en Leganés"
          disabled={disabled}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          ) : (
            <Globe className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto">
          {suggestions.map((address, index) => (
            <div
              key={`${address.fullAddress}-${index}`}
              className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
              }`}
              onClick={() => handleSuggestionClick(address)}
            >
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">{address.street}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {address.postalCode && `${address.postalCode} `}
                    {address.city}
                    {address.province && `, ${address.province}`}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSourceColor(address.source)}`}>
                    {address.source}
                  </span>
                  {index === selectedIndex && <Check className="h-4 w-4 text-blue-500" />}
                </div>
              </div>
            </div>
          ))}

          <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <span>🎯 Búsqueda mejorada con múltiples fuentes</span>
              {apiInfo && (
                <div className="flex gap-2">
                  {apiInfo.local > 0 && <span className="text-green-600">Local: {apiInfo.local}</span>}
                  {apiInfo.nominatim > 0 && <span className="text-blue-600">OSM: {apiInfo.nominatim}</span>}
                  {apiInfo.photon > 0 && <span className="text-purple-600">Photon: {apiInfo.photon}</span>}
                  {apiInfo.mapbox > 0 && <span className="text-orange-600">MapBox: {apiInfo.mapbox}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && !isLoading && query.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-gray-500 text-sm">
          <Globe className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          No se encontraron direcciones para "{query}"
          <div className="text-xs mt-2 space-y-1">
            <div>💡 Pruebe: "Calle Lisboa en Leganés"</div>
            <div>🔍 O: "Gran Via Madrid"</div>
          </div>
        </div>
      )}

      {query.length > 0 && query.length < 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3 text-center text-gray-500 text-xs">
          <Loader2 className="h-4 w-4 mx-auto mb-1 text-gray-300" />
          Escriba al menos 3 caracteres...
        </div>
      )}
    </div>
  )
}
