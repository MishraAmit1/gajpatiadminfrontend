import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Eye, Reply, Trash2, Filter } from "lucide-react";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "New", value: "New" },
  { label: "In Progress", value: "In Progress" },
  { label: "Resolved", value: "Resolved" },
  { label: "Closed", value: "Closed" },
];
const purposeOptions = [
  { label: "All", value: "all" },
  { label: "Tender", value: "Tender" },
  { label: "Site Use", value: "Site Use" },
  { label: "Resale", value: "Resale" },
  { label: "Other", value: "Other" },
];

const Inquiries = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [purpose, setPurpose] = useState("all");
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch all inquiries (no pagination)
  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getInquiries();
      setInquiries(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch inquiries");
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Row actions
  const handleView = (id) => navigate(`/inquiries/${id}`);
  const handleReply = (id) => navigate(`/inquiries/${id}?reply=1`);
  const handleDelete = (id) => navigate(`/inquiries/${id}?delete=1`);

  // Filtered inquiries (frontend)
  const filtered = inquiries.filter((inq) => {
    const matchesSearch =
      !debouncedSearch ||
      inq.customerName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      inq.customerEmail
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase()) ||
      inq.companyName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      inq.city?.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesStatus = status === "all" || inq.status === status;
    const matchesPurpose = purpose === "all" || inq.purpose === purpose;
    return matchesSearch && matchesStatus && matchesPurpose;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inquiries</h1>
          <p className="text-muted-foreground">
            Manage customer inquiries and messages
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{inquiries.length} Total</Badge>
          <Badge variant="destructive">
            {inquiries.filter((i) => i.status === "New").length} New
          </Badge>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Inquiry Management</CardTitle>
            <CardDescription>
              View, respond to, and manage all customer inquiries
            </CardDescription>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Input
              placeholder="Search inquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 pr-8"
            />
            <Select value={status} onValueChange={setStatus}>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </Select>
            <Select value={purpose} onValueChange={setPurpose}>
              {purposeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left font-semibold">Name</th>
                  <th className="px-4 py-2 text-left font-semibold">Email</th>
                  <th className="px-4 py-2 text-left font-semibold">Phone</th>
                  <th className="px-4 py-2 text-left font-semibold">Company</th>
                  <th className="px-4 py-2 text-left font-semibold">City</th>
                  <th className="px-4 py-2 text-left font-semibold">Purpose</th>
                  <th className="px-4 py-2 text-left font-semibold">Product</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-4 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={9} className="px-4 py-2">
                        <Skeleton className="h-6 w-full" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.map((inq) => (
                    <tr key={inq._id} className="border-b last:border-0">
                      <td className="px-4 py-2 font-medium">
                        {inq.customerName}
                      </td>
                      <td className="px-4 py-2">{inq.customerEmail}</td>
                      <td className="px-4 py-2">{inq.customerPhone}</td>
                      <td className="px-4 py-2">{inq.companyName}</td>
                      <td className="px-4 py-2">{inq.city}</td>
                      <td className="px-4 py-2">
                        <Badge variant="outline">{inq.purpose}</Badge>
                      </td>
                      <td className="px-4 py-2">
                        {inq.productId?.name || "-"}
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          variant={
                            inq.status === "New"
                              ? "destructive"
                              : inq.status === "Resolved"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {inq.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="outline">
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleView(inq._id)}
                            >
                              <Eye className="h-4 w-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleReply(inq._id)}
                            >
                              <Reply className="h-4 w-4 mr-2" /> Reply
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleDelete(inq._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-2 text-center text-muted-foreground"
                    >
                      No inquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inquiries;
