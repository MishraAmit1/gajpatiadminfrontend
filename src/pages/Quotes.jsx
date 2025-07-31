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

const Quotes = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [quotes, setQuotes] = useState([]);
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

  // Fetch all quotes (no pagination)
  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getQuotes();
      setQuotes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch quotes");
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  // Row actions
  const handleView = (id) => navigate(`/quotes/${id}`);
  const handleReply = (id) => navigate(`/quotes/${id}?reply=1`);
  const handleDelete = (id) => navigate(`/quotes/${id}?delete=1`);

  // Filtered quotes (frontend)
  const filtered = quotes.filter((quote) => {
    const matchesSearch =
      !debouncedSearch ||
      quote.customerName
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase()) ||
      quote.customerEmail
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase()) ||
      quote.city?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      quote.selectedProducts?.some((product) =>
        product.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    const matchesStatus = status === "all" || quote.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotes</h1>
          <p className="text-muted-foreground">
            Manage customer quote requests
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{quotes.length} Total</Badge>
          <Badge variant="destructive">
            {quotes.filter((q) => q.status === "New").length} New
          </Badge>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Quote Management</CardTitle>
            <CardDescription>
              View, respond to, and manage all customer quote requests
            </CardDescription>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Input
              placeholder="Search quotes..."
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
                  <th className="px-4 py-2 text-left font-semibold">City</th>
                  <th className="px-4 py-2 text-left font-semibold">
                    Products
                  </th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-4 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="px-4 py-2">
                        <Skeleton className="h-6 w-full" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.map((quote) => (
                    <tr key={quote._id} className="border-b last:border-0">
                      <td className="px-4 py-2 font-medium">
                        {quote.customerName}
                      </td>
                      <td className="px-4 py-2">{quote.customerEmail}</td>
                      <td className="px-4 py-2">{quote.customerPhone}</td>
                      <td className="px-4 py-2">{quote.city}</td>
                      <td className="px-4 py-2">
                        {quote.selectedProducts?.join(", ") || "-"}
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          variant={
                            quote.status === "New"
                              ? "destructive"
                              : quote.status === "Resolved"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {quote.status}
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
                              onClick={() => handleView(quote._id)}
                            >
                              <Eye className="h-4 w-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleReply(quote._id)}
                            >
                              <Reply className="h-4 w-4 mr-2" /> Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(quote._id)}
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
                      colSpan={7}
                      className="px-4 py-2 text-center text-muted-foreground"
                    >
                      No quotes found.
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

export default Quotes;
