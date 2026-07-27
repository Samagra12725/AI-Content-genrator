import React, { useState } from "react";
import { Sparkles, Copy, Check, RefreshCw, AlertCircle, CheckCircle2, FileText, Info } from "lucide-react";
import { api } from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [brandName, setBrandName] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("");
  const [generatedContent, setGeneratedContent] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
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

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!productName || !productCategory || !brandName || !keyFeatures || !targetAudience) {
      return showToast("Please fill in all form fields", "error");
    }

    setLoading(true);
    setLoadingPhase("Analyzing product details...");
    
    // Animate loader phases for rich experience
    const phases = [
      { text: "Contacting OpenRouter AI endpoint...", delay: 1500 },
      { text: "Synthesizing marketing taglines...", delay: 4000 },
      { text: "Drafting SEO description parameters...", delay: 7500 },
      { text: "Polishing and formatting content segments...", delay: 11000 }
    ];

    const timeouts = phases.map(phase => 
      setTimeout(() => {
        setLoadingPhase(phase.text);
      }, phase.delay)
    );

    try {
      const response = await api.generateContent({
        productName,
        productCategory,
        brandName,
        keyFeatures,
        targetAudience
      });

      if (response.success) {
        setGeneratedContent(response.data);
        showToast("Product copy generated successfully!", "success");
      } else {
        showToast(response.message || "Failed to generate content", "error");
      }
    } catch (err) {
      showToast(err.message || "Connection timed out. Please try again.", "error");
    } finally {
      timeouts.forEach(t => clearTimeout(t));
      setLoading(false);
      setLoadingPhase("");
    }
  };

  return (
    <div className="dashboard-wrapper">
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === "success" ? <CheckCircle2 size={18} className="toast-icon-success" /> : <AlertCircle size={18} className="toast-icon-error" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="container dashboard-container">
        <div className="dashboard-grid">
          
          {/* Left Column: Form Card */}
          <div className="glass-card form-card-wrapper">
            <div className="card-header-icon">
              <Sparkles className="form-glow-icon" />
              <h3>Product Specifications</h3>
            </div>
            
            <form onSubmit={handleGenerate} className="dashboard-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="brandName">Brand Name</label>
                  <input
                    id="brandName"
                    type="text"
                    className="form-input"
                    placeholder="e.g., Apple, Nike, Nestlé"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="productName">Product Name</label>
                  <input
                    id="productName"
                    type="text"
                    className="form-input"
                    placeholder="e.g., Air Max 90, iPhone 16"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="productCategory">Product Category</label>
                <input
                  id="productCategory"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Footwear, Smart Technology, Organic Foods"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="targetAudience">Target Audience</label>
                <input
                  id="targetAudience"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Athletes, Teenagers, Eco-conscious parents"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="keyFeatures">Key Features (One per line / comma separated)</label>
                <textarea
                  id="keyFeatures"
                  className="form-input form-textarea"
                  placeholder="e.g., Premium mesh construction, Waterproof fabric, Rechargeable battery, 24-hour runtime"
                  value={keyFeatures}
                  onChange={(e) => setKeyFeatures(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary generate-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="spin-icon" size={18} />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>{generatedContent ? "Regenerate Content" : "Generate Product Content"}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Output Display Card */}
          <div className="output-column">
            {loading ? (
              <div className="glass-card loading-state-card">
                <div className="loader-orbit-box">
                  <div className="orbit-core"></div>
                  <div className="orbit-ring-1"></div>
                  <div className="orbit-ring-2"></div>
                </div>
                <h4>Crafting Your Copy</h4>
                <p className="loading-phase-text">{loadingPhase}</p>
                <p className="loading-helper-subtext">This process runs through OpenRouter's high-speed pipelines and typically finishes in 4-8 seconds.</p>
              </div>
            ) : generatedContent ? (
              <div className="generated-results-wrapper">
                <div className="results-toolbar">
                  <div className="results-title-bar">
                    <FileText className="results-icon" />
                    <h4>Generated Output</h4>
                  </div>
                  <button 
                    onClick={() => handleCopy(formatAllContentForCopy(generatedContent), "all")} 
                    className={`btn btn-secondary btn-sm copy-all-btn ${copiedSection === "all" ? "copy-pulse success-border" : ""}`}
                  >
                    {copiedSection === "all" ? <Check size={16} className="text-success-icon" /> : <Copy size={16} />}
                    <span>{copiedSection === "all" ? "Copied All!" : "Copy All Content"}</span>
                  </button>
                </div>

                <div className="generated-cards-container">
                  {/* Tagline Card */}
                  <div className="glass-card result-inner-card tagline-card">
                    <div className="result-inner-header">
                      <h5>Tagline</h5>
                      <button onClick={() => handleCopy(generatedContent.aiGeneratedContent.tagline, "tagline")} className="icon-copy-btn" title="Copy Tagline">
                        {copiedSection === "tagline" ? <Check size={15} className="text-success-icon" /> : <Copy size={15} />}
                      </button>
                    </div>
                    <p className="tagline-output">"{generatedContent.aiGeneratedContent.tagline}"</p>
                  </div>

                  {/* Short Description Card */}
                  <div className="glass-card result-inner-card">
                    <div className="result-inner-header">
                      <h5>Short Description (2-3 lines)</h5>
                      <button onClick={() => handleCopy(generatedContent.aiGeneratedContent.shortDescription, "short description")} className="icon-copy-btn" title="Copy Short Description">
                        {copiedSection === "short description" ? <Check size={15} className="text-success-icon" /> : <Copy size={15} />}
                      </button>
                    </div>
                    <p className="output-text-content">{generatedContent.aiGeneratedContent.shortDescription}</p>
                  </div>

                  {/* Product Description Card */}
                  <div className="glass-card result-inner-card">
                    <div className="result-inner-header">
                      <h5>Product Description (150-200 words)</h5>
                      <button onClick={() => handleCopy(generatedContent.aiGeneratedContent.description, "description")} className="icon-copy-btn" title="Copy Description">
                        {copiedSection === "description" ? <Check size={15} className="text-success-icon" /> : <Copy size={15} />}
                      </button>
                    </div>
                    <p className="output-text-content justify-text">{generatedContent.aiGeneratedContent.description}</p>
                  </div>

                  {/* Key Selling Points Card */}
                  <div className="glass-card result-inner-card">
                    <div className="result-inner-header">
                      <h5>Key Selling Points</h5>
                      <button onClick={() => handleCopy(generatedContent.aiGeneratedContent.keySellingPoints.map((p, i) => `${i+1}. ${p}`).join("\n"), "selling points")} className="icon-copy-btn" title="Copy Selling Points">
                        {copiedSection === "selling points" ? <Check size={15} className="text-success-icon" /> : <Copy size={15} />}
                      </button>
                    </div>
                    <ul className="selling-points-list">
                      {generatedContent.aiGeneratedContent.keySellingPoints.map((point, index) => (
                        <li key={index}>
                          <span className="point-bullet"></span>
                          <span className="point-text">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* SEO Keywords Card */}
                  <div className="glass-card result-inner-card">
                    <div className="result-inner-header">
                      <h5>SEO Keywords</h5>
                      <button onClick={() => handleCopy(generatedContent.aiGeneratedContent.seoKeywords.join(", "), "keywords")} className="icon-copy-btn" title="Copy Keywords">
                        {copiedSection === "keywords" ? <Check size={15} className="text-success-icon" /> : <Copy size={15} />}
                      </button>
                    </div>
                    <div className="keywords-tags-container">
                      {generatedContent.aiGeneratedContent.seoKeywords.map((keyword, index) => (
                        <span key={index} className="keyword-tag">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card empty-state-card">
                <Sparkles className="empty-sparkle-icon" size={48} />
                <h4>No Product Copy Generated Yet</h4>
                <p>Provide specifications in the form on the left and hit the generate button. Our AI will compile taglines, summaries, SEO key terms, and bullet points tailored specifically for your target demographic.</p>
                <div className="empty-info-bubble">
                  <Info size={16} className="info-icon" />
                  <span>Your content will be saved automatically to your workspace history.</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>


    </div>
  );
};

export default Dashboard;
