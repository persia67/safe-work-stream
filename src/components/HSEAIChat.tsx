import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Loader2, Settings, WifiOff, Wifi, Cpu, Cloud } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { streamChat, getOfflineAISettings, saveOfflineAISettings, pingOllama, type OfflineAISettings } from '@/lib/offlineAI';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface HSEAIChatProps {
  pageContext?: string;
}

export const HSEAIChat = ({ pageContext }: HSEAIChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [settings, setSettings] = useState<OfflineAISettings>(getOfflineAISettings());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draftSettings, setDraftSettings] = useState<OfflineAISettings>(settings);
  const [ollamaReachable, setOllamaReachable] = useState<boolean | null>(null);
  const [lastSource, setLastSource] = useState<'ollama' | 'cloud' | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setIsLoading(true);

    let assistant = '';
    const result = await streamChat(
      next.map((m) => ({ role: m.role, content: m.content })),
      pageContext,
      {
        onSource: (s) => setLastSource(s),
        onDelta: (chunk) => {
          assistant += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === 'assistant') {
              return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistant } : m));
            }
            return [...prev, { role: 'assistant', content: assistant }];
          });
        },
      }
    );

    if (!result.ok) {
      toast({
        title: 'خطا',
        description: navigator.onLine
          ? 'پاسخی از سرویس هوش مصنوعی دریافت نشد. اتصال Ollama را بررسی کنید.'
          : 'آفلاین هستید و هوش مصنوعی محلی پیکربندی نشده است.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openSettings = async () => {
    setDraftSettings(getOfflineAISettings());
    setSettingsOpen(true);
    setOllamaReachable(null);
  };

  const testOllama = async () => {
    setOllamaReachable(null);
    const ok = await pingOllama(draftSettings.endpoint);
    setOllamaReachable(ok);
  };

  const saveSettings = () => {
    saveOfflineAISettings(draftSettings);
    setSettings(draftSettings);
    setSettingsOpen(false);
    toast({ title: 'تنظیمات ذخیره شد' });
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 left-6 z-50 w-96 h-[500px] shadow-xl flex flex-col">
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">مشاور هوش مصنوعی HSE</h3>
                <p className="text-xs opacity-90">متخصص ایمنی و بهداشت حرفه‌ای</p>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="gap-1 text-[10px] h-5">
                  {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                  {isOnline ? 'آنلاین' : 'آفلاین'}
                </Badge>
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20" onClick={openSettings}>
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent dir="rtl">
                    <DialogHeader>
                      <DialogTitle>تنظیمات هوش مصنوعی آفلاین</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="enabled">فعال‌سازی AI محلی (Ollama)</Label>
                        <Switch
                          id="enabled"
                          checked={draftSettings.enabled}
                          onCheckedChange={(v) => setDraftSettings({ ...draftSettings, enabled: v })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="prefer">ترجیح آفلاین حتی در حالت آنلاین</Label>
                        <Switch
                          id="prefer"
                          checked={draftSettings.preferOffline}
                          onCheckedChange={(v) => setDraftSettings({ ...draftSettings, preferOffline: v })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endpoint">آدرس Ollama</Label>
                        <Input
                          id="endpoint"
                          value={draftSettings.endpoint}
                          onChange={(e) => setDraftSettings({ ...draftSettings, endpoint: e.target.value })}
                          placeholder="http://localhost:11434"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="model">نام مدل</Label>
                        <Input
                          id="model"
                          value={draftSettings.model}
                          onChange={(e) => setDraftSettings({ ...draftSettings, model: e.target.value })}
                          placeholder="llama3.1"
                          dir="ltr"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={testOllama}>تست اتصال</Button>
                        {ollamaReachable === true && <Badge variant="default" className="bg-green-600">متصل</Badge>}
                        {ollamaReachable === false && <Badge variant="destructive">در دسترس نیست</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground leading-6">
                        برای استفاده از AI آفلاین، ابتدا <a href="https://ollama.com" target="_blank" rel="noreferrer" className="underline">Ollama</a> را نصب کرده و یک مدل مانند <code>llama3.1</code> را با دستور <code dir="ltr">ollama pull llama3.1</code> دانلود کنید.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button onClick={saveSettings}>ذخیره</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">سلام! من مشاور هوش مصنوعی HSE هستم.</p>
                <p className="text-xs mt-2">چگونه می‌توانم به شما کمک کنم؟</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="text-sm whitespace-pre-wrap" dir="rtl">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3"><Loader2 className="h-4 w-4 animate-spin" /></div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {lastSource && (
            <div className="px-4 py-1 text-[10px] text-muted-foreground border-t flex items-center gap-1 justify-end">
              {lastSource === 'ollama' ? <><Cpu className="h-3 w-3" /> پاسخ از مدل محلی</> : <><Cloud className="h-3 w-3" /> پاسخ از سرویس ابری</>}
            </div>
          )}

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="پیام خود را بنویسید..."
                className="min-h-[60px] resize-none"
                dir="rtl"
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon" className="h-[60px] w-[60px]">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};
