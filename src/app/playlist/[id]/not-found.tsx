import { AlertTriangle, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <CardTitle className="text-2xl">Playlist Not Found</CardTitle>
          <CardDescription>
            The playlist you're looking for doesn't exist or you don't have
            permission to view it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">This could be because:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• The playlist was deleted or made private</li>
              <li>• You don't have access to this playlist</li>
              <li>• The link is incorrect or expired</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/dashboard">
              <Button className="w-full bg-purple-500 hover:bg-purple-600">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
            </Link>
            {/* <Link href="/dashboard">
              <Button variant="outline" className="w-full bg-transparent">
                <Search className="mr-2 h-4 w-4" />
                Browse Playlists
              </Button>
            </Link> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
