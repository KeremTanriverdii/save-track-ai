import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPie, Dot, FileChartLine, FileCheck, Layers, Rocket, Shield, TrendingUpIcon, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="sm:w-1/2 p-3 mx-auto mt-10 space-y-10">
      <div className="flex items-center gap-10 justify-between">
        <div className="text-center sm:text-start">
          <Badge variant='default' className="bg-violet-500"><Dot className="mr-2" size={20} /> New Generation Finance</Badge>
          <h2 className="lg:text-6xl font-bold">Discover Freedom in <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-200 to-violet-600">Finance</span>
          </h2>
          <p className="text-muted-foreground lg:text-lg">The most modern way to track your expenses, manage your budget wisely, and secure your future. </p>
          <br />
          <Link className="bg-violet-700 p-3 rounded-md text-black hover:bg-violet-800" href="/dashboard">
            Get Started
          </Link>
        </div>
        <div className="h-1/2 w-1/2 hidden md:block lg:block">
          <Image src={'/logotrack.png'} alt="logo" width={800} height={800}
            className="border-2 border-green-800 rounded-2xl mt-2"
          />
        </div>
        <div>
        </div>
      </div>

      <div className="mt-30">
        <h2 className="text-2xl text-center font-bold mb-10">Why Choose New Generation Finance?</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg-grid-cols-3 gap-3">
          <li >
            <Card
              className="h-full w-full bg-purple-700 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="mr-2" color="green" size={30} /> Intuitive Expense Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                Easily log and categorize your expenses with our user-friendly interface.
              </CardContent>
            </Card>
          </li>

          <li >
            <Card className="h-full w-full bg-purple-700 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="mr-2" color="green" size={30} /> Comprehensive Budget Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                Set budgets, monitor spending, and receive insights to stay on track.
              </CardContent>
            </Card>
          </li>

          <li >
            <Card className="h-full w-full bg-purple-700 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="mr-2" color="green" size={30} /> Secure and Private
                </CardTitle>
              </CardHeader>
              <CardContent>
                Your financial data is protected with top-notch security measures.
              </CardContent>
            </Card>
          </li>

          <li>
            <Card className="h-full w-full bg-purple-700 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUpIcon className="mr-2" color="green" size={30} />
                  <h2>Future Planning Tools</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                Future Planning Tools: Utilize our tools to plan for savings, investments, and financial goals.
              </CardContent>
            </Card>
          </li>
        </ul>
      </div>

      <section id="features">
        <div className="mt-30 text-center">
          <h4 className="text-violet-600 font-bold mb-2">Features
            <br />
            <span className="text-white">The smartest way to manage your finances</span>
          </h4>
          <p className="text-muted-foreground">All the tools you need to achieve your financial goals, in one place,
            <br />
            without complicated tables.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mx-auto mt-10">
          <Card>
            <CardHeader>
              <CardTitle>
                <FileChartLine className="mb-4 h-8 w-8 text-violet-600" /> <br />
                Easy Expense Tracking
              </CardTitle>
              <CardContent>
                <p>Record your expenses in seconds. Instantly see how much you spent on what and get an analysis report with AI-powered categorization.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Wallet className="mb-4 h-8 w-8 text-violet-600" /> <br />
                Smartest Budget Management
              </CardTitle>
              <CardContent>
                <p>Set monthly limits and reach your goals. Eliminate surprise spending with overdraft alerts.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <ChartPie className="mb-4 h-8 w-8 text-violet-600" /> <br />
                Deeply Insightful Reports
              </CardTitle>
              <CardContent>
                <p>Discover where your money is going with visual charts and reports. Identify savings opportunities.</p>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </section>

      <div>
        <Card className="text-center mt-10">
          <CardHeader className="text-nowrap">
            <CardTitle className="lg:text-6xl">
              <Rocket className="mx-auto mb-6" color="violet" size={40} />
              <h2>
                Start managing your <br />
                <span className="text-violet-600">
                  Money Today.
                </span>
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mt-4 mb-8 text-muted-foreground">
              Join New Generation Finance and take control of your financial future. Sign up now and exerience the difference!
            </p>
            <CardAction className="w-1/2 mx-auto">
              <Link href={'/dashboard'}>
                <Button className="bg-violet-700 rounded-md w-full" size={'lg'}>
                  Get Started Now
                </Button>
              </Link>
            </CardAction>
          </CardContent>
        </Card>
      </div>


    </div>
  );
}
