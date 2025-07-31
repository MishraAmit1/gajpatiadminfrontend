import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Trash2 } from "lucide-react";

const statusOptions = [
  { label: "New", value: "New" },
  { label: "In Progress", value: "In Progress" },
  { label: "Resolved", value: "Resolved" },
  { label: "Closed", value: "Closed" },
];

const QuoteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [status, setStatus] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch quote
  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .getQuote(id)
      .then((res) => {
        setQuote(res.data);
        setStatus(res.data.status);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch quote");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Add reply
  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setReplyLoading(true);
    setSuccess("");
    setError("");
    try {
      const newReplies = [
        ...(quote.replies || []),
        { message: reply, repliedAt: new Date() },
      ];
      await api.updateQuote(id, { replies: newReplies });
      setQuote((prev) => ({ ...prev, replies: newReplies }));
      setReply("");
      setSuccess("Reply sent successfully.");
    } catch (err) {
      setError(err.message || "Failed to send reply");
    } finally {
      setReplyLoading(false);
    }
  };

  // Update status
  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === quote.status) return;
    setStatusLoading(true);
    setSuccess("");
    setError("");
    try {
      await api.updateQuote(id, { status: newStatus });
      setQuote((prev) => ({ ...prev, status: newStatus }));
      setStatus(newStatus);
      setSuccess("Status updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  // Delete quote
  const handleDelete = async () => {
    setDeleteLoading(true);
    setError("");
    try {
      await api.deleteQuote(id);
      setSuccess("Quote deleted successfully.");
      setTimeout(() => navigate("/quotes"), 1000);
    } catch (err) {
      setError(err.message || "Failed to delete quote");
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-6 w-1/3 mb-2" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    );
  }
  if (!quote) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Quote Details</CardTitle>
          <CardDescription>View and manage this quote request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <Alert variant="default">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-semibold">Customer Name:</div>
              <div>{quote.customerName}</div>
            </div>
            <div>
              <div className="font-semibold">Email:</div>
              <div>{quote.customerEmail}</div>
            </div>
            <div>
              <div className="font-semibold">Phone:</div>
              <div>{quote.customerPhone}</div>
            </div>
            <div>
              <div className="font-semibold">City:</div>
              <div>{quote.city}</div>
            </div>
            <div>
              <div className="font-semibold">Products:</div>
              <div>{quote.selectedProducts?.join(", ") || "-"}</div>
            </div>
            <div>
              <div className="font-semibold">Status:</div>
              <Select
                value={status}
                onValueChange={handleStatusUpdate}
                disabled={statusLoading}
              >
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <div className="font-semibold">Created At:</div>
              <div className="text-muted-foreground">
                {new Date(quote.createdAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  dateStyle: "full",
                  timeStyle: "medium",
                })}
              </div>
            </div>
            <div>
              <div className="font-semibold">Quote Sent:</div>
              <div className="text-muted-foreground">
                {new Date(quote.updatedAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  dateStyle: "full",
                  timeStyle: "medium",
                })}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleteLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </CardFooter>
      </Card>
      {/* Replies Section */}
      <Card>
        <CardHeader>
          <CardTitle>Replies</CardTitle>
          <CardDescription>
            View and add replies to this quote request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            {quote.replies && quote.replies.length > 0 ? (
              quote.replies.map((rep, idx) => (
                <div key={idx} className="rounded bg-muted p-3">
                  <div className="text-sm text-muted-foreground mb-1">
                    {new Date(rep.repliedAt).toLocaleString()}
                  </div>
                  <div>{rep.message}</div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">No replies yet.</div>
            )}
          </div>
          <form onSubmit={handleReply} className="flex gap-2 items-end">
            <Input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply..."
              disabled={replyLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={replyLoading || !reply.trim()}>
              {replyLoading ? "Sending..." : "Send Reply"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-sm relative">
            <h2 className="text-lg font-bold mb-4">Delete Quote?</h2>
            <p className="mb-4">
              This will permanently delete the quote. This action cannot be
              undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteView;
