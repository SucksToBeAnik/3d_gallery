"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// Sample predefined model names for search functionality
const modelNames = [
  "Classic Burger",
  "Veggie Delight",
  "Spicy Chicken",
  "Supreme Pizza",
  "Pasta Primavera",
  "Chocolate Cake",
  "Strawberry Smoothie",
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filteredResults = modelNames.filter((model) =>
      model.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#102831] text-white shadow-2xl">
      <div className="container flex h-24 items-center justify-between px-4">
        {/* Logo and Brand */}

        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Avatar className="size-18">
              <AvatarImage
                src="/logo.png"
                alt="Logo"
                className="object-cover rounded-full bg-secondary"
              />
              <AvatarFallback>Logo</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold">Khabar360</span>
              <span className="text-xs font-semibold">
                Elevate your cravings
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Button variant="link" asChild className="text-white">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
          </Button>
          <Button variant="link" asChild className="text-white">
            <Link href="/models" className="text-sm font-medium">
              Models
            </Link>
          </Button>

          {/* Desktop Search */}
          <div className="relative">
            <div className="flex items-center">
              <Input
                type="search"
                placeholder="Search models..."
                className="pr-8 border-0 ring-1"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
              />
              <Search className="absolute right-2 h-4 w-4 text-muted-foreground" />
            </div>

            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full mt-1 w-full rounded-md border bg-background shadow-lg">
                <ul className="py-1">
                  {searchResults.map((result, index) => (
                    <li key={index}>
                      <Link
                        href={`/models/${result
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="block px-4 py-2 hover:bg-accent text-primary"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                      >
                        {result}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="px-4">
            <div className="flex flex-col gap-6 pt-6">
              <SheetClose asChild>
                <Link href="/" className="text-lg font-medium">
                  Home
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/models" className="text-lg font-medium">
                  Models
                </Link>
              </SheetClose>

              {/* Mobile Search */}
              <div className="relative mt-4">
                <div className="flex items-center">
                  <Input
                    type="search"
                    placeholder="Search models..."
                    className="w-full pr-8"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <Search className="absolute right-2 h-4 w-4 text-muted-foreground" />
                </div>

                {searchResults.length > 0 && (
                  <div className="mt-2 w-full rounded-md border bg-background">
                    <ul className="py-1">
                      {searchResults.map((result, index) => (
                        <li key={index}>
                          <SheetClose asChild>
                            <Link
                              href={`/models/${result
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                              className="block px-4 py-2 hover:bg-accent"
                              onClick={() => {
                                setSearchQuery("");
                                setSearchResults([]);
                              }}
                            >
                              {result}
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
