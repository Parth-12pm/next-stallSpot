"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Save, Plus, Building2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Stall, StallFormProps } from "@/components/events/types/types"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

const DEFAULT_CATEGORIES = ["Art", "Food", "Jewelry", "Clothing", "Handicrafts", "Electronics", "Books", "General"]

export default function StallForm({
  eventId,
  eventDetails,
  onSave,
  readOnly = false,
  isOrganizer = false,
  onStallSelect,
  userRole,
}: StallFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null)
  const [customCategory, setCustomCategory] = useState("")
  const [customSize, setCustomSize] = useState("")
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const router = useRouter()

  const [stalls, setStalls] = useState<Stall[]>(() =>
    Array.from({ length: eventDetails.numberOfStalls }, (_, i) => ({
      stallId: i + 1,
      displayId: `${i + 1}`,
      type: "standard" as const,
      category: eventDetails.category,
      name: "",
      price: "5000",
      size: "3x3",
      status: "available" as const,
    })),
  )

  useEffect(() => {
    const fetchStalls = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/events/${eventId}/stalls`)
        if (!response.ok) throw new Error("Failed to fetch stalls")
        const data = await response.json()
        setStalls(data.stalls)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stalls")
      } finally {
        setIsLoading(false)
      }
    }

    if (eventId) {
      fetchStalls()
    }
  }, [eventId])

  const handleStallClick = (stall: Stall) => {
    if (readOnly && stall.status !== "available") return
    setSelectedStall(stall)
  }

  const isValidSizeFormat = (size: string) => {
    return /^\d+(\.\d+)?x\d+(\.\d+)?$/.test(size)
  }

  const updateStallDetails = (field: keyof Stall, value: string) => {
    if (!selectedStall || readOnly) return

    setStalls((prevStalls) =>
      prevStalls.map((stall) => (stall.stallId === selectedStall.stallId ? { ...stall, [field]: value } : stall)),
    )

    setSelectedStall((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleAddCategory = () => {
    if (!customCategory.trim()) return
    setCategories((prev) => [...prev, customCategory.trim()])
    if (selectedStall) {
      updateStallDetails("category", customCategory.trim())
    }
    setCustomCategory("")
  }

  const applyToAllStalls = () => {
    if (!selectedStall || readOnly) return

    setStalls((prevStalls) =>
      prevStalls.map((stall) => ({
        ...stall,
        type: selectedStall.type,
        category: selectedStall.category,
        price: selectedStall.price,
        size: selectedStall.size,
      })),
    )
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const invalidStalls = stalls.filter((stall) => stall.size === "custom" || !isValidSizeFormat(stall.size))

      if (invalidStalls.length > 0) {
        throw new Error("All stalls must have valid sizes")
      }

      if (onSave) {
        await onSave(stalls)
      } else {
        const response = await fetch(`/api/events/${eventId}/stalls`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stalls,
            configurationComplete: true,
          }),
        })

        if (!response.ok) throw new Error("Failed to save stalls")

        toast({
          title: "Success",
          description: "Stall configuration saved. You can now preview and publish your event.",
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save stalls")
    } finally {
      setIsLoading(false)
    }
  }

  const getStallColorByStatus = (status: Stall["status"], type: string) => {
    if (!isOrganizer) {
      return status === "available"
        ? `bg-green-100 border-green-300 ${type === "premium" ? "border-yellow-400" : ""}`
        : `bg-gray-100 border-gray-300 ${type === "premium" ? "border-yellow-400" : ""}`
    }

    const colors = {
      available: "bg-green-100 border-green-300",
      reserved: "bg-yellow-100 border-yellow-300",
      blocked: "bg-red-100 border-red-300",
      booked: "bg-blue-100 border-blue-300",
    }

    return `${colors[status]} ${type === "premium" ? "border-yellow-400" : ""}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b  p-6 mb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stall Configuration</h1>
          {isOrganizer && !readOnly && (
            <div className="flex gap-4">
              <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={() => router.push(`/dashboard/events/${eventId}/preview`)}
                disabled={!stalls.length}
                variant="outline"
                className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300"
              >
                Preview & Publish
              </Button>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Layout and Stalls */}
          <div className="space-y-6">
            <Card className="p-6  shadow-lg rounded-xl">
              <h2 className="text-xl font-semibold  mb-4">Stall Layout</h2>
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-6">
                <div className="w-full h-full flex items-center justify-center ">
                  {eventDetails.layout ? (
                    <Image
                      src={eventDetails.layout || "/placeholder.svg"}
                      alt="Event Layout"
                      className="w-full h-full object-cover"
                      width={800}
                      height={600}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                      No thumbnail available
                    </div>
                  )}
                </div>
              </div>
              <div className="max-h-[500px] overflow-y-auto pr-2 pm-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 mt-4 mb-4">
                  {stalls.map((stall) => (
                    <Button
                      key={stall.stallId}
                      onClick={() => handleStallClick(stall)}
                      disabled={!isOrganizer && stall.status !== "available"}
                      className={`p-4 h-auto aspect-square text-left flex flex-col items-start justify-between transition-all relative ${getStallColorByStatus(
                        stall.status,
                        stall.type,
                      )} ${
                        selectedStall?.stallId === stall.stallId ? "ring-2 ring-blue-500" : ""
                      } hover:border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed`}
                      variant="outline"
                    >
                      {stall.type === "premium" && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full shadow-sm" />
                      )}
                      <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-800 font-medium truncate flex items-center gap-1 w-full">
                        {stall.name || `Stall ${stall.displayId}`}
                      </div>
                      <Badge
                        variant="default"
                        className={`mt-1 w-full h-auto justify-center text-xs  ${
                          stall.status === "available"
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-100 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {isOrganizer ? stall.status : stall.status === "available" ? "Available" : "Not\nAvailable"}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Side - Stall Details */}
          <div className="space-y-6">
            <Card className="p-6  shadow-lg rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {selectedStall ? `Stall ${selectedStall.displayId} Details` : "Select a stall to view details"}
              </h2>

              {selectedStall ? (
                <div className="space-y-6">
                  {/* Stall Identifier Section */}
                  {isOrganizer && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="stallName" className="text-gray-700 dark:text-gray-300">
                          Stall Number
                        </Label>
                        <Input
                          id="stallName"
                          value={selectedStall.displayId}
                          onChange={(e) => updateStallDetails("displayId", e.target.value)}
                          placeholder="Enter stall number"
                          disabled={readOnly}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stallName" className="text-gray-700 dark:text-gray-300">
                          Display Name (Optional)
                        </Label>
                        <Input
                          id="customName"
                          value={selectedStall.name}
                          onChange={(e) => updateStallDetails("name", e.target.value)}
                          placeholder="Enter a display name"
                          disabled={readOnly}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Category Section */}
                  <div className="space-y-2">
                    <Label htmlFor="stallCategory" className="text-gray-700 dark:text-gray-300">
                      Category
                    </Label>
                    {!isOrganizer ? (
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {selectedStall.category}
                      </div>
                    ) : (
                      <>
                        <Select
                          value={selectedStall.category}
                          onValueChange={(value) => updateStallDetails("category", value)}
                          disabled={readOnly}
                        >
                          <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                            <SelectItem value="custom">Add Custom...</SelectItem>
                          </SelectContent>
                        </Select>

                        {selectedStall.category === "custom" && (
                          <div className="flex gap-2 mt-2">
                            <Input
                              value={customCategory}
                              onChange={(e) => setCustomCategory(e.target.value)}
                              placeholder="Enter custom category"
                              disabled={readOnly}
                              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                            <Button
                              size="sm"
                              onClick={handleAddCategory}
                              disabled={readOnly}
                              className="bg-blue-500 text-white hover:bg-blue-600"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Type and Size Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stallType" className="text-gray-700 dark:text-gray-300">
                        Type
                      </Label>
                      {!isOrganizer ? (
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                          {selectedStall.type}
                        </div>
                      ) : (
                        <Select
                          value={selectedStall.type}
                          onValueChange={(value) => updateStallDetails("type", value)}
                          disabled={readOnly}
                        >
                          <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="corner">Corner</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stallSize" className="text-gray-700 dark:text-gray-300">
                        Size
                      </Label>
                      {!isOrganizer ? (
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {selectedStall.size}
                          {selectedStall.size !== "custom" && " ft"}
                        </div>
                      ) : (
                        <>
                          <Select
                            value={
                              selectedStall.size.match(/^\d+(\.\d+)?x\d+(\.\d+)?$/) ? "custom" : selectedStall.size
                            }
                            onValueChange={(value) => {
                              if (value === "custom") {
                                setCustomSize("")
                                updateStallDetails("size", "")
                              } else {
                                setCustomSize("")
                                updateStallDetails("size", value)
                              }
                            }}
                            disabled={readOnly}
                          >
                            <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2x2">2ft x 2ft</SelectItem>
                              <SelectItem value="3x3">3ft x 3ft</SelectItem>
                              <SelectItem value="5x5">5ft x 5ft</SelectItem>
                              <SelectItem value="10x10">10ft x 10ft</SelectItem>
                              <SelectItem value="custom">Custom Size</SelectItem>
                            </SelectContent>
                          </Select>

                          {(selectedStall.size === "custom" ||
                            selectedStall.size.match(/^\d+(\.\d+)?x\d+(\.\d+)?$/)) && (
                            <div className="flex gap-2 mt-2">
                              <div className="relative flex-1">
                                <Input
                                  value={customSize || selectedStall.size}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    setCustomSize(value)
                                    if (isValidSizeFormat(value)) {
                                      updateStallDetails("size", value)
                                    }
                                  }}
                                  placeholder="Enter size (e.g., 4x4)"
                                  disabled={readOnly}
                                  className={`w-full p-2 border rounded-md ${
                                    !isValidSizeFormat(customSize || selectedStall.size)
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } focus:ring-2 focus:ring-blue-500`}
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                  ft
                                </div>
                              </div>
                            </div>
                          )}
                          {(selectedStall.size === "custom" || selectedStall.size.match(/^\d+(\.\d+)?x\d+(\.\d+)?$/)) &&
                            !isValidSizeFormat(customSize || selectedStall.size) && (
                              <p className="text-xs text-red-500 mt-1">
                                Please enter size in format: widthxheight (e.g., 4x4)
                              </p>
                            )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Price and Status Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stallPrice" className="text-gray-700 dark:text-gray-300">
                        Price (₹)
                      </Label>
                      {!isOrganizer ? (
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          ₹{selectedStall.price}
                        </div>
                      ) : (
                        <Input
                          id="stallPrice"
                          type="number"
                          value={selectedStall.price}
                          onChange={(e) => updateStallDetails("price", e.target.value)}
                          placeholder="Enter price"
                          disabled={readOnly}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stallStatus" className="text-gray-700 dark:text-gray-300 ">
                        Status
                      </Label>
                      {!isOrganizer ? (
                        <Badge
                          variant="default"
                          className={`mt-1 ml-4 ${
                            selectedStall.status === "available"
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                          }`}
                        >
                          {selectedStall.status === "available" ? "Available" : "Not Available"}
                        </Badge>
                      ) : (
                        <Select
                          value={selectedStall.status}
                          onValueChange={(value: Stall["status"]) => updateStallDetails("status", value)}
                          disabled={readOnly}
                        >
                          <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="reserved">Reserved</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                            <SelectItem value="booked">Booked</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isOrganizer && !readOnly && (
                    <div className="pt-4 space-y-4">
                      <Button
                        onClick={applyToAllStalls}
                        variant="outline"
                        className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
                      >
                        Apply Settings to All Stalls
                      </Button>
                    </div>
                  )}

                  {/* Vendor Apply Button */}
                  {!isOrganizer && selectedStall.status === "available" && (
                    <div className="pt-4">
                      <Button
                        className="w-full bg-blue-600 text-white hover:bg-blue-700"
                        size="lg"
                        onClick={() => onStallSelect?.(selectedStall)}
                        disabled={userRole !== "vendor"}
                      >
                        <Building2 className="w-4 h-4 mr-2" />
                        Apply for This Stall
                      </Button>
                      {userRole !== "vendor" && (
                        <p className="text-sm text-gray-500 mt-2 text-center">Only vendors can apply for stalls.</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Select a stall from the layout to view its details
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

