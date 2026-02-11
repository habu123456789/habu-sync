import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import BlogPostPage from "./pages/BlogPostPage";
import AuthPage from "./pages/AuthPage";
import WritePage from "./pages/WritePage";
import EditPostPage from "./pages/EditPostPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/post/:postId" element={<BlogPostPage />} />
            <Route path="/post/local/:postId" element={<BlogPostPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/write" element={<WritePage />} />
            <Route path="/edit/:postId" element={<EditPostPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
