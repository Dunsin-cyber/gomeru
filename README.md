# Gomeru 🔐⚡

**Gomeru** is a Nostr MiniApp (Tool Widget) that enables lightweight, embeddable Bitcoin-powered monetization inside Nostr posts. It supports two core modes: pay-to-unlock content and Lightning payment splitting. Built using the YakiHonne Smart Widgets framework, Gomeru makes it easy to get paid directly from Nostr — no apps, no middlemen.

---

## 🚀 Features

### 1. Pay-to-Unlock Mode (`🔓`)
- Lock any content (text, links, files, etc.) behind a Lightning paywall
- Only accessible after a successful payment
- Simple, creator-friendly monetization

### 2. Split-Tip Mode (`⚡`)
- Accept tips or donations with sats split across multiple recipients
- Great for teams, collaborations, or group support
- Customizable splits per recipient

---

## 🛠 How It Works

1. User visits the **Gomeru** widget via a Nostr post
2. Selects content or tipping widget type
3. Makes a Lightning payment using Alby, Wallet of Satoshi, etc.
4. Gomeru verifies the payment:
   - Reveals content (Pay-to-Unlock)
   - Displays success message (Split-Tip)
5. Behind the scenes, sats are routed through LNBits and split if needed

---

## ⚙️ Technologies Used

- **React + Tailwind** – UI for the widget
- **YakiHonne Smart Widget Handler** – For Nostr Tool Widget integration
- **LNBits API** – For invoice creation and split payments
- **Vercel / Netlify** – Hosting the MiniApp
- **Nostr Protocol** – For embedding and interacting with the widget in a decentralized way

---

## 💡 Why Gomeru?

- **Decentralized Monetization** – No platform fees, no middlemen
- **Portable** – Share it in a Nostr post, DM, or feed
- **Composability** – Works seamlessly with Nostr clients and Bitcoin tools
- **One-click UX** – Instant Lightning payments and content access

---

## 📦 Deployment

To deploy your own version of Gomeru:

1. Fork the repo
2. Update your `.env` with your LNBits keys or settings
3. Deploy to Vercel or Netlify
4. Make sure your `/.well-known/widget.json` is correctly configured:
```json
{
  "pubkey": "your-nostr-pubkey-in-hex",
  "widget": {
    "title": "Gomeru",
    "appUrl": "https://your-domain.com",
    "iconUrl": "https://your-domain.com/icon.png",
    "imageUrl": "https://your-domain.com/preview.png",
    "buttonTitle": "Launch Gomeru",
    "tags": ["tool", "lightning", "paywall", "nostr"]
  }
}
