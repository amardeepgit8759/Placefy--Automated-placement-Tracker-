"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, Building2 } from "lucide-react";
import { clsx } from "clsx";

const COMPANIES = [
  "Apple", "Microsoft", "Google", "Amazon", "Meta", "Adobe", "Salesforce", "Oracle", "SAP", "IBM", 
  "Intel", "NVIDIA", "AMD", "Qualcomm", "Cisco", "HP", "Dell", "Lenovo", "Samsung Electronics", "Sony", 
  "Panasonic", "LG Electronics", "Tesla", "SpaceX", "Uber", "Airbnb", "Netflix", "Spotify", "PayPal", "Stripe", 
  "Square", "Shopify", "Zoom", "Dropbox", "Slack", "Atlassian", "Twitter (X)", "Snap", "Pinterest", "TikTok (ByteDance)", 
  "Tencent", "Alibaba", "Baidu", "JD.com", "Xiaomi", "Oppo", "Vivo", "Ericsson", "Nokia", "ASML", 
  "Broadcom", "VMware", "ServiceNow", "Workday", "Snowflake", "Datadog", "Palantir", "CrowdStrike", "Fortinet", "Palo Alto Networks", 
  "Okta", "Twilio", "GitHub", "GitLab", "Unity", "Roblox", "Electronic Arts", "Activision Blizzard", "Epic Games", "Riot Games", 
  "ARM Holdings", "Capgemini", "Accenture", "Cognizant", "Infosys BPM", "Globant", "Endava", "ThoughtWorks", "Wise", "Revolut",
  "Tata Consultancy Services", "Infosys", "Wipro", "HCLTech", "Tech Mahindra", "L&T Technology Services", "Mindtree", "Mphasis", 
  "Persistent Systems", "Coforge", "Oracle Financial Services Software", "Tata Elxsi", "Cyient", "Birlasoft", "Zensar Technologies", 
  "Hexaware Technologies", "NIIT Technologies", "KPIT Technologies", "Ramco Systems", "Happiest Minds", "Affle India", "Tanla Platforms", 
  "Route Mobile", "Newgen Software", "Intellect Design Arena", "Saksoft", "eClerx", "Firstsource Solutions", "3i Infotech", 
  "Quick Heal Technologies", "Subex", "Redington India", "Vakrangee", "OnMobile Global", "Datamatics Global Services", "UST Global", 
  "Zoho Corporation", "Freshworks", "Flipkart", "Paytm", "Razorpay", "PhonePe", "Ola", "Swiggy", "Zomato", "BYJU'S", 
  "Unacademy", "Meesho", "CRED", "Nykaa"
].sort();

interface CompanySearchProps {
  value: string | null;
  onChange: (value: string) => void;
}

export default function CompanySearch({ value, onChange }: CompanySearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredCompanies = COMPANIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-4 h-4 text-zinc-400" />
        <h2 className="text-sm font-medium text-zinc-300">Target Company</h2>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-full flex items-center justify-between p-3 rounded-lg border transition-all text-sm font-medium bg-zinc-900/80 hover:border-zinc-700",
          isOpen ? "border-indigo-500 ring-1 ring-indigo-500/20" : "border-zinc-800"
        )}
      >
        <span className={clsx(value ? "text-white" : "text-zinc-500")}>
          {value || "Select a company..."}
        </span>
        <ChevronDown className={clsx("w-4 h-4 text-zinc-500 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#0B0B0E] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-zinc-800 flex items-center gap-2 bg-zinc-900/50">
            <Search className="w-4 h-4 text-zinc-500 ml-2" />
            <input
              autoFocus
              className="w-full bg-transparent border-none outline-none text-sm text-white py-2 placeholder:text-zinc-600"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-y-auto pt-1 pb-1 scrollbar-thin scrollbar-thumb-zinc-800">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <button
                  key={company}
                  type="button"
                  onClick={() => {
                    onChange(company);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={clsx(
                    "w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors",
                    value === company 
                      ? "bg-indigo-600 text-white" 
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  )}
                >
                  {company}
                  {value === company && <Check className="w-4 h-4 text-white" />}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-zinc-500">
                No companies found matching "{search}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
