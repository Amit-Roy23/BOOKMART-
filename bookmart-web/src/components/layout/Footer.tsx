import Link from 'next/link';
import { Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold text-white">Bookmart</span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              The marketplace for students to buy and sell second-hand books. Building a community
              of readers and learners.
            </p>
            <div className="flex items-center gap-3">
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-teal-primary transition-colors">
                <Send className="w-4 h-4" />
              </Link>
              <Link href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-teal-primary transition-colors">
                <Send className="w-4 h-4" />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-teal-primary transition-colors">
                <Send className="w-4 h-4" />
              </Link>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-teal-primary transition-colors">
                <Send className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-xs hover:text-teal-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-xs hover:text-teal-primary transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-xs hover:text-teal-primary transition-colors">
                  Sell Book
                </Link>
              </li>
              <li>
                <Link href="/dashboard/listings" className="text-xs hover:text-teal-primary transition-colors">
                  My Listings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/college-insights" className="text-xs hover:text-teal-primary transition-colors">
                  College Insights
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-xs hover:text-teal-primary transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/requests/post" className="text-xs hover:text-teal-primary transition-colors">
                  Post Request
                </Link>
              </li>
              <li>
                <Link href="/" className="text-xs hover:text-teal-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-4">Newsletter</h3>
            <p className="text-xs text-slate-500 mb-3">
              Subscribe to get updates on new books and features.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-teal-primary text-white placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-teal-primary text-white rounded-lg hover:bg-teal-primary/90 transition-colors"
                aria-label="Subscribe to newsletter"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Bookmart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
