"use client";

import Link from "next/link";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { postsApi } from "@/lib/api/posts.api";
import {
  Post,
  PostStatus,
  SocialPlatform,
  ApiErrorShape,
} from "@/types/domain";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  PenTool,
  Search,
  CheckCircle2,
  XCircle,
  History,
  RotateCcw,
  Sparkles,
  Edit2,
  Instagram,
  Facebook,
  AlertCircle,
  ArrowRight,
  Clock,
  User,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

export default function PostsPage() {
  const { t } = useI18n();

  // Data & loading
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus | "ALL">("ALL");
  const [platformFilter, setPlatformFilter] = useState<SocialPlatform | "ALL">("ALL");

  // Active Modals
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Post Editor state (WEB-02-06)
  const [editTitle, setEditTitle] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editHashtags, setEditHashtags] = useState("");
  const [editCta, setEditCta] = useState("");
  const [editVisualIdea, setEditVisualIdea] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);

  // Rejection modal state (WEB-02-07)
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  // Load Posts from API
  const loadPosts = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const res = await postsApi.getPosts({
        search: searchQuery,
        status: statusFilter,
        platform: platformFilter,
      });
      setPosts(res.data);
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setStatusMessage({
        type: "error",
        text: apiErr.message || t.common.errorOccurred,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [searchQuery, statusFilter, platformFilter]);

  // Open Post Editor Modal
  const handleOpenEditor = (post: Post) => {
    setSelectedPost(post);
    setEditTitle(post.currentVersion.title);
    setEditCaption(post.currentVersion.caption);
    setEditHashtags(post.currentVersion.hashtags.join(" "));
    setEditCta(post.currentVersion.callToAction);
    setEditVisualIdea(post.currentVersion.visualIdea || "");
    setEditorError(null);
    setIsEditorOpen(true);
  };

  // Open Version History Modal
  const handleOpenHistory = (post: Post) => {
    setSelectedPost(post);
    setIsHistoryOpen(true);
  };

  // Open Rejection Dialog
  const handleOpenReject = (post: Post) => {
    setSelectedPost(post);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  // Submit Post Edits (creates a new version!)
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;
    setIsSavingEdit(true);
    setEditorError(null);

    const hashtagsArray = editHashtags
      .split(/\s+/)
      .map((h) => (h.startsWith("#") ? h : `#${h}`))
      .filter((h) => h.length > 1);

    try {
      const res = await postsApi.updatePost(selectedPost.id, {
        title: editTitle.trim(),
        caption: editCaption.trim(),
        hashtags: hashtagsArray,
        callToAction: editCta.trim(),
        visualIdea: editVisualIdea.trim(),
      });

      setPosts((prev) =>
        prev.map((p) => (p.id === selectedPost.id ? res.data : p))
      );
      setSelectedPost(res.data);
      setIsEditorOpen(false);
      setStatusMessage({
        type: "success",
        text: t.posts.postSaved,
      });
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setEditorError(apiErr.message || t.common.errorOccurred);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Explicit Human Approval (WEB-02-07)
  const handleApprove = async (post: Post) => {
    try {
      const res = await postsApi.approvePost(post.id);
      setPosts((prev) => prev.map((p) => (p.id === post.id ? res.data : p)));
      setStatusMessage({
        type: "success",
        text: t.posts.postApprovedMsg,
      });
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setStatusMessage({
        type: "error",
        text: apiErr.message || "Failed to approve post",
      });
    }
  };

  // Explicit Rejection
  const handleConfirmReject = async () => {
    if (!selectedPost || !rejectionReason.trim()) return;
    setIsSubmittingReject(true);
    try {
      const res = await postsApi.rejectPost(
        selectedPost.id,
        rejectionReason.trim()
      );
      setPosts((prev) =>
        prev.map((p) => (p.id === selectedPost.id ? res.data : p))
      );
      setIsRejectModalOpen(false);
      setStatusMessage({
        type: "success",
        text: t.posts.postRejectedMsg,
      });
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setStatusMessage({
        type: "error",
        text: apiErr.message || "Failed to reject post",
      });
    } finally {
      setIsSubmittingReject(false);
    }
  };

  // Revert to Version (WEB-02-06)
  const handleRevertVersion = async (versionNumber: number) => {
    if (!selectedPost) return;
    if (
      confirm(
        `${t.posts.revertConfirm} ${versionNumber}?`
      )
    ) {
      try {
        const res = await postsApi.revertVersion(selectedPost.id, versionNumber);
        setPosts((prev) =>
          prev.map((p) => (p.id === selectedPost.id ? res.data : p))
        );
        setSelectedPost(res.data);
        setIsHistoryOpen(false);
        setStatusMessage({
          type: "success",
          text: `Reverted to revision #${versionNumber} successfully.`,
        });
      } catch (err) {
        console.error("Revert failed", err);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {t.posts.title}
          </h1>
          <p className="text-sm text-txt-secondary mt-1">{t.posts.subtitle}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadPosts}
            title="Refresh from API"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync
          </Button>

          <Link href="/content-studio">
            <Button
              variant="primary"
              leftIcon={<Sparkles className="w-4 h-4 text-accent-cyan" />}
            >
              Generate New Post in Studio
            </Button>
          </Link>
        </div>
      </div>

      {/* Global Status Banner */}
      {statusMessage && (
        <div
          role="alert"
          className={`p-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-3 animate-in fade-in ${
            statusMessage.type === "success"
              ? "bg-semantic-success/15 border border-semantic-success/40 text-semantic-success"
              : "bg-semantic-error/15 border border-semantic-error/40 text-semantic-error"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="ms-auto p-1 hover:opacity-70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="w-full lg:w-80">
            <Input
              placeholder={t.posts.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftElement={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-44">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as PostStatus | "ALL")
                }
                className="glass-input w-full h-11 px-3 text-xs text-white bg-navy-900 focus:outline-none"
              >
                <option value="ALL">{t.posts.filterAll}</option>
                <option value="PENDING_REVIEW">{t.posts.pendingReview}</option>
                <option value="APPROVED">{t.posts.approved}</option>
                <option value="REJECTED">{t.posts.rejected}</option>
                <option value="DRAFT">{t.posts.draft}</option>
                <option value="SCHEDULED">{t.posts.scheduled}</option>
                <option value="PUBLISHED">{t.posts.published}</option>
              </select>
            </div>

            <div className="w-36">
              <select
                value={platformFilter}
                onChange={(e) =>
                  setPlatformFilter(e.target.value as SocialPlatform | "ALL")
                }
                className="glass-input w-full h-11 px-3 text-xs text-white bg-navy-900 focus:outline-none"
              >
                <option value="ALL">All Platforms</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="FACEBOOK">Facebook</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Skeletons on loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <Card key={i} className="p-6 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && posts.length === 0 && (
        <Card className="text-center p-10 sm:p-14 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-txt-muted flex items-center justify-center mx-auto">
            <PenTool className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            {t.posts.noPostsFound}
          </h3>
          <p className="text-xs sm:text-sm text-txt-secondary max-w-md mx-auto leading-relaxed">
            {t.posts.emptyPostsDesc}
          </p>
          <div className="pt-2 flex justify-center">
            <Link href="/content-studio">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Open AI Content Studio
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Posts Cards Grid (WEB-02-06, WEB-02-07) */}
      {!isLoading && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => {
            const curVer = post.currentVersion;
            const hasCaption = curVer.caption.trim().length >= 10;
            const hasHashtags = curVer.hashtags.length > 0;
            const hasCta = curVer.callToAction.trim().length > 0;
            const hasMedia = !!post.mediaUrl;
            const isReady = hasCaption && hasHashtags && hasCta && hasMedia;
            const isApproved = post.status === "APPROVED";
            const isRejected = post.status === "REJECTED";

            return (
              <Card
                key={post.id}
                interactive
                className="flex flex-col justify-between p-6 space-y-4 group"
              >
                <div className="space-y-3.5">
                  {/* Card Header: Platform & Approval Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {post.platform === "INSTAGRAM" ? (
                        <span className="p-1.5 rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/20">
                          <Instagram className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="p-1.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/20">
                          <Facebook className="w-4 h-4" />
                        </span>
                      )}
                      <span className="text-xs font-bold text-white truncate max-w-[180px]">
                        {post.campaignName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant={
                          isApproved
                            ? "mint"
                            : isRejected
                            ? "error"
                            : post.status === "PENDING_REVIEW"
                            ? "warning"
                            : "outline"
                        }
                        size="sm"
                      >
                        {post.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Rejection Feedback Alert (WEB-02-07) */}
                  {isRejected && post.rejectionReason && (
                    <div className="p-3 rounded-xl bg-semantic-error/15 border border-semantic-error/30 text-semantic-error text-xs flex items-start gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-semibold">
                          {t.posts.rejectionReasonLabel}:
                        </strong>
                        <span className="text-white/90">
                          {post.rejectionReason}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Title & Version Source Badge */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono font-semibold text-accent-cyan">
                        {post.productName || "Product Highlight"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 border border-white/10 text-txt-secondary flex items-center gap-1">
                        <History className="w-3 h-3 text-accent-violet" />
                        <span>
                          v{curVer.versionNumber} &bull;{" "}
                          {curVer.source === "AI_GENERATED"
                            ? t.posts.aiGeneratedTag
                            : t.posts.manualEditTag}
                        </span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-accent-violet transition-colors">
                      {curVer.title}
                    </h3>
                  </div>

                  {/* Caption & Hashtags & CTA */}
                  <div className="p-3.5 rounded-xl bg-navy-950/80 border border-white/5 space-y-2 text-xs">
                    <p className="text-white/95 leading-relaxed line-clamp-3">
                      {curVer.caption}
                    </p>
                    <p className="text-accent-cyan font-mono text-[11px] truncate">
                      {curVer.hashtags.join(" ")}
                    </p>
                    <div className="text-[11px] text-accent-mint flex items-center gap-1 pt-1 border-t border-white/5">
                      <ArrowRight className="w-3 h-3 shrink-0" />
                      <span className="truncate">{curVer.callToAction}</span>
                    </div>
                  </div>

                  {/* Publishing Readiness Checklist (WEB-02-07) */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5 text-[11px]">
                    <span className="font-bold text-txt-muted uppercase tracking-wider text-[10px] block">
                      {t.posts.readinessChecklist}:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-txt-secondary">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            hasCaption ? "text-accent-mint" : "text-white/20"
                          }`}
                        />
                        <span className={hasCaption ? "text-white" : ""}>
                          {t.posts.readinessCaption}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            hasHashtags ? "text-accent-mint" : "text-white/20"
                          }`}
                        />
                        <span className={hasHashtags ? "text-white" : ""}>
                          {t.posts.readinessHashtags}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            hasCta ? "text-accent-mint" : "text-white/20"
                          }`}
                        />
                        <span className={hasCta ? "text-white" : ""}>
                          {t.posts.readinessCta}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            hasMedia ? "text-accent-mint" : "text-white/20"
                          }`}
                        />
                        <span className={hasMedia ? "text-white" : ""}>
                          {t.posts.readinessMedia}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions: Approval, Rejection, Editor, History */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  {/* Left: Editor & History buttons */}
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditor(post)}
                      leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenHistory(post)}
                      leftIcon={<History className="w-3.5 h-3.5" />}
                      title={t.posts.versionHistory}
                    >
                      {post.versions.length} Revs
                    </Button>
                  </div>

                  {/* Right: Approval & Rejection buttons (WEB-02-07 explicit gates) */}
                  <div className="flex items-center gap-2">
                    {!isApproved && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleOpenReject(post)}
                        leftIcon={<XCircle className="w-3.5 h-3.5" />}
                      >
                        Reject
                      </Button>
                    )}

                    {!isApproved ? (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!isReady}
                        onClick={() => handleApprove(post)}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        title={
                          !isReady
                            ? t.posts.notReadyNotice
                            : t.posts.approveAction
                        }
                      >
                        {t.posts.approveAction}
                      </Button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-accent-mint font-semibold">
                        <Check className="w-4 h-4" />
                        <span>Ready for Calendar</span>
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* POST EDITOR MODAL (WEB-02-06) */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={t.posts.editPost}
        description="Refine text copy, adjust hashtags and CTA. Saving creates a new tracked revision."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          {editorError && (
            <div className="p-3 rounded-xl bg-semantic-error/15 border border-semantic-error/30 text-semantic-error text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{editorError}</span>
            </div>
          )}

          <Input
            label="Post Title / Working Headline"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />

          <Textarea
            label={t.studio.captionLabel}
            value={editCaption}
            onChange={(e) => setEditCaption(e.target.value)}
            rows={5}
            required
          />

          <Input
            label={t.studio.hashtagsLabel}
            placeholder="#MyBrand #SpecialtyCoffee"
            value={editHashtags}
            onChange={(e) => setEditHashtags(e.target.value)}
          />

          <Input
            label={t.studio.ctaLabel}
            placeholder="Tap the link in our bio to order..."
            value={editCta}
            onChange={(e) => setEditCta(e.target.value)}
            required
          />

          <Input
            label={t.studio.visualIdeaLabel}
            value={editVisualIdea}
            onChange={(e) => setEditVisualIdea(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditorOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSavingEdit}
              leftIcon={<Check className="w-4 h-4" />}
            >
              {isSavingEdit ? t.common.saving : "Save New Revision"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* VERSION HISTORY MODAL (WEB-02-06) */}
      <Modal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title={`${t.posts.versionsTitle} (${selectedPost?.versions.length || 0} Revisions)`}
        description="Inspect complete audit trail of AI generations and manual editorial revisions."
        maxWidth="xl"
      >
        <div className="space-y-4 max-h-[65vh] overflow-y-auto p-1">
          {selectedPost?.versions.map((ver) => {
            const isCurrent =
              ver.versionNumber === selectedPost.currentVersion.versionNumber;

            return (
              <div
                key={ver.id}
                className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                  isCurrent
                    ? "bg-accent-violet/15 border-accent-violet shadow-glow-violet/20"
                    : "bg-white/5 border-white/10 text-txt-secondary"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">
                      Revision #{ver.versionNumber}
                    </span>
                    <Badge
                      variant={
                        ver.source === "AI_GENERATED" ? "cyan" : "violet"
                      }
                      size="sm"
                    >
                      {ver.source === "AI_GENERATED"
                        ? t.posts.aiGeneratedTag
                        : t.posts.manualEditTag}
                    </Badge>
                    {isCurrent && (
                      <Badge variant="mint" size="sm">
                        {t.posts.currentVersionBadge}
                      </Badge>
                    )}
                  </div>

                  <span className="text-[11px] text-txt-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{ver.createdAt.split("T")[0]}</span>
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <h4 className="font-semibold text-white">{ver.title}</h4>
                  <p className="text-white/90 leading-relaxed whitespace-pre-line">
                    {ver.caption}
                  </p>
                  <p className="text-accent-cyan font-mono text-[11px]">
                    {ver.hashtags.join(" ")}
                  </p>
                  <p className="text-accent-mint text-[11px]">
                    CTA: {ver.callToAction}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-txt-muted flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>Edited by: {ver.authorName}</span>
                  </span>

                  {!isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevertVersion(ver.versionNumber)}
                      leftIcon={<RotateCcw className="w-3 h-3" />}
                    >
                      Revert to This Version
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          <div className="pt-3 border-t border-white/10 flex justify-end">
            <Button
              variant="secondary"
              onClick={() => setIsHistoryOpen(false)}
            >
              {t.common.close}
            </Button>
          </div>
        </div>
      </Modal>

      {/* REJECTION REASON MODAL (WEB-02-07) */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title={t.posts.rejectAction}
        description="Provide clear, actionable editorial feedback so the copywriter can revise the post."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          <Textarea
            label={t.posts.rejectionReasonLabel}
            placeholder={t.posts.rejectionReasonPlaceholder}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsRejectModalOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button
              variant="destructive"
              isLoading={isSubmittingReject}
              disabled={!rejectionReason.trim()}
              onClick={handleConfirmReject}
              leftIcon={<XCircle className="w-4 h-4" />}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
