import React, { useState, useEffect } from "react";
import { History as HistoryIcon, Trash2, Eye, Calendar, Tag, User, Copy, Check, Info, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "../services/api";
import "./History.css";

const History = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedSection, setCopiedSection] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await api.getHistory();
      if (response.success) {
        setHistoryItems(response.data);
        if (response.data.length > 0) {
          setSelectedItem(response.data[0]);
        } else {
          setSelectedItem(null);
        }
      } else {
        showToast(response.message || "Failed to load history", "error");
      }
    } catch (err) {
      showToast(err.message || "Could not connect to server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent selecting the item
    if (!window.confirm("Are you sure you want to delete this generated content?")) {
      return;
    }

    try {
      const response = await api.deleteContent(id);
      if (response.success) {
        showToast("Content deleted successfully");
        const updated = historyItems.filter((item) => item._id !== id);
        setHistoryItems(updated);
        
        // Update selection if deleted item was selected
        if (selectedItem && selectedItem._id === id) {
          setSelectedItem(updated.length > 0 ? updated[0] : null);
        }
      } else {
        showToast(response.message || "Failed to delete item", "error");
      }
    } catch (err) {
      showToast(err.message || "Failed to delete item", "error");
    }
  };

  const handleCopy = (text, sectionId) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    showToast(`Copied ${sectionId === "all" ? "all content" : sectionId} to clipboard!`, "success");
    setTimeout(() => {
      setCopiedSection(null);
    }, 1500);
  };

  const formatAllContentForCopy = (data) => {
    if (!data) return "";
    const ai = data.aiGeneratedContent;
    return `Brand: ${data.productDetails.brandName}
Product: ${data.productName}
Category: ${data.productCategory}

Tagline:
"${ai.tagline}"

Short Description:
${ai.shortDescription}

Description:
${ai.description}

Key Selling Points:
${ai.keySellingPoints.map((point, index) => `${index + 1}. ${point}`).join("\n")}

SEO Keywords:
${ai.seoKeywords.join(", ")}`;
  };

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <div className="history-wrapper">
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === "success" ? <CheckCircle2 size={18} className="toast-icon-success" /> : <AlertCircle size={18} className="toast-icon-error" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="container history-container">
        <div className="history-grid">
          
          {/* Left Column: History Items List */}
          <div className="glass-card list-card-wrapper">
            <div className="list-header">
              <HistoryIcon size={18} className="history-glow-icon" />
              <h3>Saved Content ({historyItems.length})</h3>
            </div>

            {loading ? (
              <div className="list-loading-box">
                <div className="spinner-loader"></div>
                <p>Loading history...</p>
              </div>
            ) : historyItems.length === 0 ? (
              <div className="empty-history-box">
                <Sparkles className="empty-history-icon" size={32} />
                <p>No content history found.</p>
                <span className="empty-history-sub">Generate product content in the dashboard to populate your saved list.</span>
              </div>
            ) : (
              <div className="history-list">
                {historyItems.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setSelectedItem(item)}
                    className={`history-item-row ${selectedItem && selectedItem._id === item._id ? "active-row" : ""}`}
                  >
                    <div className="item-meta-top">
                      <span className="item-category-badge">
                        <Tag size={10} />
                        {item.productCategory}
                      </span>
                      <span className="item-date">
                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    
                    <h4 className="item-title">{item.productName}</h4>
                    <p className="item-brand">{item.productDetails.brandName}</p>
                    <p className="item-snippet">{item.aiGeneratedContent.tagline}</p>
                    
                    <div className="item-actions-footer">
                      <button 
                        onClick={(e) => handleDelete(item._id, e)} 
                        className="btn-item-delete"
                        title="Delete Copy"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Detailed View Pane */}
          <div className="details-pane-column">
            {selectedItem ? (
              <div className="generated-results-wrapper">
                <div className="results-toolbar">
                  <div className="results-title-bar">
                    <Calendar size={16} className="results-icon" />
                    <span className="details-timestamp">Saved on {formatDate(selectedItem.createdAt)}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(formatAllContentForCopy(selectedItem), "all")}
                    className={`btn btn-secondary btn-sm copy-all-btn ${copiedSection === "all" ? "copy-pulse success-border" : ""}`}
                  >
                    {copiedSection === "all" ? <Check size={16} className="text-success-icon" /> : <Copy size={16} />}
                    <span>{copiedSection === "all" ? "Copied!" : "Copy All"}</span>
                  </button>
                </div>

                <div className="details-meta-grid">
                  <div className="meta-bubble">
                    <span className="bubble-label">Product</span>
                    <span className="bubble-value">{selectedItem.productName}</span>
                  </div>
                  <div className="meta-bubble">
                    <span className="bubble-label">Brand</span>
                    <span className="bubble-value">{selectedItem.productDetails.brandName}</span>
                  </div>
                  <div className="meta-bubble">
                    <span className="bubble-label">Category</span>
                    <span className="bubble-value">{selectedItem.productCategory}</span>
                  </div>
                  <div className="meta-bubble">
                    <span className="bubble-label">Target Audience</span>
                    <span className="bubble-value">{selectedItem.productDetails.targetAudience}</span>
                  </div>
                </div>

                <div className="generated-cards-container">
                  {/* Tagline */}
                  <div className="glass-card result-inner-card tagline-card">
                    <div className="result-inner-header">
                      <h5>Tagline</h5>
                      <button onClick={() => handleCopy(selectedItem.aiGeneratedContent.tagline, "tagline")} className="icon-copy-btn" title="Copy Tagline">
                        {copiedSection === "tagline" ? <Check size={15} className="text-success-icon" /> : <Copy size={15} />}
                      </button>
                    </div>
                    <p className="tagline-output">"{selectedItem.aiGeneratedContent.tagline}"</p>
                  </div>

                  {/* Short Description */}
                  <div className="glass-card result-inner-card">
                    <div className="result-inner-header">
                      <h5>Short Description</h5>
                      <button onClick={() => handleCopy(selectedItem.aiGeneratedContent.shortDescription, "short description")} className="icon-copy-btn" title="Copy Short Description">
                        {copiedSection === "short description" ? <Check size={15} className="text-success-icon" /> : <Copy size={15} />}
                      </button>
                    </div>
                    <p className="output-text-content">{selectedItem.aiGeneratedContent.shortDescription}</p>
                  </div>

                  {/* Product Description */}
                  <div className="glass-card result-inner-card">
                    <div className="result-inner-header">
                      <h5>Product Description</h5>
                      <button onClick={() => handleCopy(selectedItem.aiGeneratedContent.description, "description")} className="icon-copy-btn" title="Copy Description">
                        {copiedSection === "description" ? <Check size={15} className="text-success-icon" /> : <Copy size={15} />}
                      </button>
                    </div>
                    <p className="output-text-content justify-text">{selectedItem.aiGeneratedContent.description}</p>
                  </div>

                  {/* Key Selling Points */}
                  <div className="glass-card result-inner-card">
                    <div className="result-inner-header">
                      <h5>Key Selling Points</h5>
                      <button onClick={() => handleCopy(selectedItem.aiGeneratedContent.keySellingPoints.map((p, i) => `${i+1}. ${p}`).join("\n"), "selling points")} className="icon-copy-btn" title="Copy Selling Points">
                        {copiedSection === "selling points" ? <Check size={15} className="text-success-icon" /> : <Copy size={15} />}
                      </button>
                    </div>
                    <ul className="selling-points-list">
                      {selectedItem.aiGeneratedContent.keySellingPoints.map((point, index) => (
                        <li key={index}>
                          <span className="point-bullet"></span>
                          <span className="point-text">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* SEO Keywords */}
                  <div className="glass-card result-inner-card">
                    <div className="result-inner-header">
                      <h5>SEO Keywords</h5>
                      <button onClick={() => handleCopy(selectedItem.aiGeneratedContent.seoKeywords.join(", "), "keywords")} className="icon-copy-btn" title="Copy Keywords">
                        {copiedSection === "keywords" ? <Check size={15} className="text-success-icon" /> : <Copy size={15} />}
                      </button>
                    </div>
                    <div className="keywords-tags-container">
                      {selectedItem.aiGeneratedContent.seoKeywords.map((keyword, index) => (
                        <span key={index} className="keyword-tag">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card details-empty-card">
                <Info className="empty-info-icon" size={40} />
                <h4>Select generated content to view</h4>
                <p>Choose an item from the sidebar to review its tagline, descriptions, SEO metadata, and product properties.</p>
              </div>
            )}
          </div>

        </div>
      </div>


    </div>
  );
};

export default History;
