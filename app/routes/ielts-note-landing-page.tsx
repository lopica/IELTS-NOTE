import { BookOpen, Target, Trophy } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import useStore from "~/lib/store";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "IELTS NOTES" },
    { name: "description", content: "Webapp to store ielts mock test" },
  ];
}

async function listMajors() {
  let response;
  try {
    // Fetch first 10 files
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      range: "Class Data!A2:E",
    });
  } catch (err: any) {
    console.error("Execute error", err.message);
    return;
  }
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    console.log("No data found.");
    return;
  }
  // Flatten to string to display
  const output = range.values.reduce(
    (str: any, row: any) => `${str}${row[0]}, ${row[4]}\n`,
    "Name, Major:\n"
  );
  console.log(output);
}

const IeltsNoteLandingPage = () => {
  const { tokenClient, setTokenClient, gapi, setGapi, google, setGoogle } =
    useStore();

  function handleAuthClick() {
    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: "" });
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary rounded-xl">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Ielts Note
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-primary font-semibold text-balance">
            Your Path to IELTS Success
          </p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Master the IELTS exam with our comprehensive preparation platform.
            Get personalized study plans, practice tests, and expert guidance to
            achieve your target score.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 my-12">
          <div className="flex flex-col items-center space-y-3 p-6 bg-card rounded-lg border">
            <div className="p-3 bg-primary/10 rounded-full">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground">
              Targeted Practice
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Focus on your weak areas with personalized practice sessions
            </p>
          </div>

          <div className="flex flex-col items-center space-y-3 p-6 bg-card rounded-lg border">
            <div className="p-3 bg-primary/10 rounded-full">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground">
              Expert Content
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Study materials created by IELTS experts and former examiners
            </p>
          </div>

          <div className="flex flex-col items-center space-y-3 p-6 bg-card rounded-lg border">
            <div className="p-3 bg-primary/10 rounded-full">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground">
              Proven Results
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Join thousands who achieved their target IELTS scores
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-6">
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={handleAuthClick}
          >
            {/* <Link to="/list"> */}
            Start Your Preparation
            {/* </Link> */}
          </Button>

          <p className="text-sm text-muted-foreground">
            Free trial • No credit card required • Start in 30 seconds
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center">
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Contact
          </a>
        </div>
      </footer>
    </main>
  );
};

export default IeltsNoteLandingPage;
