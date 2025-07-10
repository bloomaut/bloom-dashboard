import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Instagram, MessageCircle, Users, Grid3X3, Heart, Target } from "lucide-react";

interface ProfileInfoCardProps {
  platform: "instagram" | "tiktok";
  username: string;
  followers: number;
  following: number;
  posts: number;
  engagement: number;
  profileImage?: string;
  isVerified?: boolean;
  goalsCompletion: number;
}

export function ProfileInfoCard({
  platform,
  username,
  followers,
  following,
  posts,
  engagement,
  profileImage,
  isVerified = false,
  goalsCompletion,
}: ProfileInfoCardProps) {
  const PlatformIcon = platform === "instagram" ? Instagram : MessageCircle;
  const platformColor = platform === "instagram" ? "from-purple-500 to-pink-500" : "from-gray-800 to-black";

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div
              className={`w-12 h-12 bg-gradient-to-br ${platformColor} rounded-full flex items-center justify-center`}
            >
              <PlatformIcon className='h-6 w-6 text-white' />
            </div>
            <div>
              <CardTitle className='text-lg flex items-center space-x-2'>
                <span>@{username}</span>
                {isVerified && <Badge className='bg-blue-100 text-blue-800 text-xs'>✓</Badge>}
              </CardTitle>
              <p className='text-sm text-gray-500 capitalize'>{platform}</p>
            </div>
          </div>
          <Badge className='bg-green-100 text-green-800'>Conectado</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-4'>
          <div className='text-center p-3 bg-gray-50 rounded-lg'>
            <Users className='h-4 w-4 mx-auto mb-1 text-gray-600' />
            <p className='text-lg font-bold text-gray-900'>{formatNumber(followers)}</p>
            <p className='text-xs text-gray-600'>Seguidores</p>
          </div>
          <div className='text-center p-3 bg-gray-50 rounded-lg'>
            <Grid3X3 className='h-4 w-4 mx-auto mb-1 text-gray-600' />
            <p className='text-lg font-bold text-gray-900'>{posts}</p>
            <p className='text-xs text-gray-600'>Posts</p>
          </div>
          <div className='text-center p-3 bg-gray-50 rounded-lg'>
            <Heart className='h-4 w-4 mx-auto mb-1 text-gray-600' />
            <p className='text-lg font-bold text-gray-900'>{engagement}%</p>
            <p className='text-xs text-gray-600'>Engagement</p>
          </div>
          <div className='text-center p-3 bg-blue-50 rounded-lg'>
            <Target className='h-4 w-4 mx-auto mb-1 text-blue-600' />
            <p className='text-lg font-bold text-blue-900'>{goalsCompletion}%</p>
            <p className='text-xs text-blue-700'>Metas completadas</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
