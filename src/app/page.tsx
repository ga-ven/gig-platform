import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Users, Briefcase, Shield, Star, ArrowRight, MapPin, Clock, MessageCircle } from "lucide-react"

const mockJobs = [
  {
    id: "1",
    title: "急需搬家师傅",
    description: "从朝阳区搬到海淀区，约3箱物品，需要帮忙搬运下楼",
    location: "朝阳区",
    pay_amount: 300,
    required_skills: ["搬家", "体力活"],
    job_time_start: "2024-01-15",
    employer_name: "李先生",
  },
  {
    id: "2",
    title: "水管维修",
    description: "厨房水管漏水，需要专业师傅上门维修，材料我方提供",
    location: "海淀区",
    pay_amount: 200,
    required_skills: ["水电", "维修"],
    job_time_start: "2024-01-16",
    employer_name: "王女士",
  },
  {
    id: "3",
    title: "空调安装",
    description: "新买的空调需要安装，3楼，需要自带工具",
    location: "西城区",
    pay_amount: 150,
    required_skills: ["空调", "安装"],
    job_time_start: "2024-01-17",
    employer_name: "张先生",
  },
  {
    id: "4",
    title: "家具组装",
    description: "宜家衣柜和书桌需要组装，预计2小时完成",
    location: "东城区",
    pay_amount: 180,
    required_skills: ["家具", "组装"],
    job_time_start: "2024-01-18",
    employer_name: "赵女士",
  },
  {
    id: "5",
    title: "保洁服务",
    description: "120平米新房开荒保洁，需要专业保洁师傅",
    location: "丰台区",
    pay_amount: 400,
    required_skills: ["保洁", "清洁"],
    job_time_start: "2024-01-19",
    employer_name: "刘先生",
  },
  {
    id: "6",
    title: "电路检修",
    description: "家里电路跳闸，需要师傅上门检查维修",
    location: "通州区",
    pay_amount: 250,
    required_skills: ["电工", "维修"],
    job_time_start: "2024-01-20",
    employer_name: "陈女士",
  },
]

const testimonials = [
  {
    id: 1,
    role: "师傅",
    name: "张师傅",
    content: "在平台接单太方便了！上周接了3个搬家单，收入2000多，比以前到处找活强多了。",
    rating: 5,
  },
  {
    id: 2,
    role: "雇主",
    name: "李女士",
    content: "家里水管漏水，在平台发布任务后10分钟就有师傅联系，专业又省心！",
    rating: 5,
  },
  {
    id: 3,
    role: "师傅",
    name: "王师傅",
    content: "平台的资金托管让我很放心，干完活就能收到钱，不用担心被拖欠。",
    rating: 5,
  },
  {
    id: 4,
    role: "雇主",
    name: "陈先生",
    content: "找师傅再也不用到处打听，平台上的师傅都有评分，选起来特别放心。",
    rating: 5,
  },
  {
    id: 5,
    role: "师傅",
    name: "刘师傅",
    content: "注册简单，接单方便，一个月下来比以前多赚了不少，推荐给老乡们！",
    rating: 5,
  },
  {
    id: 6,
    role: "雇主",
    name: "赵女士",
    content: "发布任务、选师傅、支付一气呵成，整个过程透明，再也不怕被坑了。",
    rating: 5,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Play className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">零工平台</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">登录</Button>
            </Link>
            <Link href="/auth/register">
              <Button>注册</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            简单四步 · 轻松撮合
          </Badge>
          <h1 className="text-5xl font-bold mb-6">
            连接雇主与师傅的
            <br />
            <span className="text-primary">智能零工撮合平台</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            雇主发布任务，师傅快速接单，平台资金托管，双向评价保障
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8">
                立即开始
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">最新任务</h2>
            <p className="text-muted-foreground">
              浏览雇主发布的零工任务，找到合适的工作
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-1">{job.title}</CardTitle>
                    <Badge className="bg-green-100 text-green-700 shrink-0">待接单</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.required_skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <span className="text-xs">¥</span>
                      <span>{job.pay_amount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{job.job_time_start}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      {job.employer_name}
                    </span>
                    <Link href="/auth/register">
                      <Button size="sm" variant="outline">查看详情</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/auth/register">
              <Button variant="outline" size="lg">
                查看更多任务
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">四步完成零工撮合</h2>
            <p className="text-muted-foreground">
              简单流程，安全可靠
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                步骤 1
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>注册账号</CardTitle>
                <CardDescription>
                  选择角色（雇主/师傅），完善个人信息
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                步骤 2
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>发布/接任务</CardTitle>
                <CardDescription>
                  雇主发布任务需求，师傅浏览申请
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                步骤 3
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>支付托管</CardTitle>
                <CardDescription>
                  雇主预付资金，平台托管保障双方
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                步骤 4
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>完成评价</CardTitle>
                <CardDescription>
                  任务完成，双向评价，平台分账
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">角色功能</h2>
            <p className="text-muted-foreground">
              为雇主和师傅提供专属功能
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  雇主
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">1</Badge>
                  <span>发布零工任务需求</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">2</Badge>
                  <span>查看师傅申请并选择</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">3</Badge>
                  <span>预付资金到平台托管</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">4</Badge>
                  <span>确认完成并评价师傅</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-green-500" />
                  师傅
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">1</Badge>
                  <span>浏览可接的零工任务</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">2</Badge>
                  <span>申请感兴趣的任务</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">3</Badge>
                  <span>完成任务获得报酬</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">4</Badge>
                  <span>积累评分提升信誉</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <MessageCircle className="h-8 w-8" />
              用户好评
            </h2>
            <p className="text-blue-100">
              听听他们怎么说
            </p>
          </div>
          
          <div className="relative">
            <div className="flex gap-6 animate-scroll">
              {[...testimonials, ...testimonials].map((item, index) => (
                <Card key={`${item.id}-${index}`} className="min-w-[320px] bg-white/10 backdrop-blur-sm border-white/20 text-white shrink-0">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        {item.role === "师傅" ? (
                          <Briefcase className="h-5 w-5" />
                        ) : (
                          <Users className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-blue-200">{item.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-blue-100 line-clamp-3">"{item.content}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-muted-foreground mb-8">
            立即注册，开始您的零工之旅
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="text-lg px-8">
              <Play className="mr-2 h-5 w-5" />
              立即开始
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 零工平台</p>
        </div>
      </footer>
    </div>
  )
}
