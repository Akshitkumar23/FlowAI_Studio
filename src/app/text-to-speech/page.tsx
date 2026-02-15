
"use client";

import { useState, useRef, useEffect } from "react";
import { textToSpeech } from "@/ai/flows/text-to-speech-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AudioLines, Download, User, Users, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const voices = [
    { name: 'algenib', gender: 'Male' },
    { name: 'achernar', gender: 'Male' },
    { name: 'algieba', gender: 'Male' },
    { name: 'alnilam', gender: 'Male' },
    { name: 'charon', gender: 'Male' },
    { name: 'enceladus', gender: 'Male' },
    { name: 'achird', gender: 'Female' },
    { name: 'aoede', gender: 'Female' },
    { name: 'autonoe', gender: 'Female' },
    { name: 'callirrhoe', gender: 'Female' },
    { name: 'despina', gender: 'Female' },
];

const singleSpeakerExample = "Hello, this is a demonstration of the text-to-speech functionality. You can type any text here and have it read aloud in the selected voice.";
const multiSpeakerExample = "Speaker1: Hi, how are you doing?\nSpeaker2: I'm doing great, thanks for asking! How about you?\nSpeaker1: I'm doing well too. I was just trying out this new text-to-speech tool.\nSpeaker2: It sounds really good!";


const AudioVisualizer = () => (
  <div className="flex items-center justify-center space-x-1 h-10">
    {[...Array(5)].map((_, i) => (
        <span key={i} className={cn("w-1.5 bg-primary/80 animate-voice-bar", `animation-delay-${i*100}`)} />
    ))}
    <style jsx>{`
      .animate-voice-bar {
        animation-name: voice-bar;
        animation-duration: 1.2s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        animation-direction: alternate;
      }
      .animation-delay-0 { animation-delay: 0s; }
      .animation-delay-100 { animation-delay: 0.1s; }
      .animation-delay-200 { animation-delay: 0.2s; }
      .animation-delay-300 { animation-delay: 0.3s; }
      .animation-delay-400 { animation-delay: 0.4s; }

      @keyframes voice-bar {
        0% { height: 0.25rem; }
        50% { height: 2.5rem; }
        100% { height: 0.25rem; }
      }
    `}</style>
  </div>
);


export default function TextToSpeechPage() {
  const [text, setText] = useState("");
  const [multiSpeaker, setMultiSpeaker] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [voice1, setVoice1] = useState('algenib');
  const [voice2, setVoice2] = useState('achernar');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audioElement.addEventListener('play', onPlay);
    audioElement.addEventListener('pause', onPause);
    audioElement.addEventListener('ended', onEnded);
    
    return () => {
        audioElement.removeEventListener('play', onPlay);
        audioElement.removeEventListener('pause', onPause);
        audioElement.removeEventListener('ended', onEnded);
    }
  }, [audioSrc]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) {
      alert("Please enter some text to convert.");
      return;
    }

    setIsLoading(true);
    setAudioSrc(null);
    setIsPlaying(false);

    try {
      const response = await textToSpeech({
        text,
        multiSpeakerMode: multiSpeaker,
        voice1,
        voice2,
      });
      setAudioSrc(response.media);
    } catch (error) {
      console.error("Error converting text to speech:", error);
      alert("Failed to convert text to speech. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!audioSrc) return;
    const link = document.createElement("a");
    link.href = audioSrc;
    link.download = "speech.wav";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleTryExample = () => {
    setText(multiSpeaker ? multiSpeakerExample : singleSpeakerExample);
  }
  
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="min-h-full animated-gradient-bg">
    <div className="container py-8">
      <PageHeader
        title="Text-to-Speech Studio"
        description="Convert text to speech with single-narrator or multi-speaker dialogue options and a variety of voices."
      />

      <div className="max-w-2xl mx-auto">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Convert Text to Speech</CardTitle>
            <CardDescription>
              Enter your text below. For multi-speaker mode, use the format `Speaker1: ...` and `Speaker2: ...` on new lines.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="text-input">Text</Label>
                    <Button type="button" variant="link" onClick={handleTryExample}>
                        <Wand2 className="mr-2 h-4 w-4"/> Try an Example
                    </Button>
                </div>
                <Textarea
                  id="text-input"
                  placeholder="Type your text or script here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={8}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="multi-speaker-mode"
                  checked={multiSpeaker}
                  onCheckedChange={setMultiSpeaker}
                />
                <Label htmlFor="multi-speaker-mode">Multi-speaker Mode</Label>
              </div>

              {multiSpeaker ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="voice-1" className="flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Speaker 1</Label>
                         <Select value={voice1} onValueChange={setVoice1}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {voices.map(v => <SelectItem key={v.name} value={v.name}>{capitalizeFirstLetter(v.name)} ({v.gender})</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="voice-2" className="flex items-center gap-2"><Users className="h-4 w-4 text-accent" /> Speaker 2</Label>
                        <Select value={voice2} onValueChange={setVoice2}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {voices.map(v => <SelectItem key={v.name} value={v.name}>{capitalizeFirstLetter(v.name)} ({v.gender})</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
              ) : (
                <div className="space-y-2">
                    <Label htmlFor="voice-1">Voice</Label>
                    <Select value={voice1} onValueChange={setVoice1}>
                        <SelectTrigger><SelectValue placeholder="Select a voice" /></SelectTrigger>
                        <SelectContent>
                            {voices.map(v => <SelectItem key={v.name} value={v.name}>{capitalizeFirstLetter(v.name)} ({v.gender})</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
              )}

              <Button type="submit" disabled={isLoading || !text} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Audio...
                  </>
                ) : (
                  <>
                    <AudioLines className="mr-2 h-4 w-4" />
                    Generate Audio
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}

        {audioSrc && (
          <Card className="mt-8 glass">
            <CardHeader>
              <CardTitle>Your Audio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-grow">
                  <audio ref={audioRef} controls src={audioSrc} className="w-full">
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <Button variant="outline" size="icon" onClick={handleDownload} title="Download Audio">
                  <Download className="h-5 w-5"/>
                </Button>
              </div>
              {isPlaying && <AudioVisualizer />}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </div>
  );
}
