import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Code, Database, Users, Star, Award } from 'lucide-react';

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Kashish Gandhi",
      role: "Team Lead & Full-Stack Developer",
      idNumber: "23DCS028",
      description: "Leads the entire project development, handles both frontend and backend development, guides overall direction, ensures deadlines are met, and coordinates between all team members.",
      avatar: "https://media.licdn.com/dms/image/v2/D4E03AQHR44KfDa3ygQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1693650718013?e=2147483647&v=beta&t=B8hWNHeYGPkzQnsUmW6YcAdXV7EArpZC04aWpT3MYL4",
      responsibilities: ["Project Leadership", "Frontend Development", "Backend Development", "Team Coordination", "Full-Stack Architecture", "Quality Assurance"],
      icon: <Star className="w-6 h-6" />
    },
    {
      id: 2,
      name: "Harmit Jetani",
      role: "Frontend Developer",
      idNumber: "23DCS040",
      description: "Works on the frontend design and user interface. Responsible for creating an interactive, visually appealing, and responsive experience for readers.",
      avatar: "https://media.licdn.com/dms/image/v2/D4D03AQGgxXmmjehpzg/profile-displayphoto-shrink_200_200/B4DZWvgPD8G4AY-/0/1742406225863?e=2147483647&v=beta&t=O4ue7lXA3DvLd_rK5kVh6mLFocZJH-8KFS4IGWWI3mo",
      responsibilities: ["UI/UX Design", "React Development", "Responsive Design", "User Experience", "Component Development"],
      icon: <Code className="w-6 h-6" />
    },
    {
      id: 3,
      name: "Manan Monani",
      role: "Backend Developer",
      idNumber: "23DCS063",
      description: "Works on the backend systems and database. Ensures smooth data handling, secure user management, and efficient content delivery.",
      avatar: "https://media.licdn.com/dms/image/v2/D4E03AQEH0Z9f45BDjA/profile-displayphoto-shrink_200_200/B4EZPN4b4kHkAY-/0/1734325945910?e=2147483647&v=beta&t=z-v4L9R_lzpfPfaR4em-iN_JgTUI93YLtKLg8dLS_5M",
      responsibilities: ["Backend Development", "Database Management", "API Development", "Security Implementation", "Server Configuration"],
      icon: <Database className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-indo-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indo-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold indo-text-gradient">IndoGyaan Team</h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Meet the passionate developers behind IndoGyaan - a platform dedicated to preserving and sharing 
            the rich knowledge and culture of India in the digital age.
          </p>
          <Badge className="bg-indo-accent text-white text-lg px-6 py-2">
            ज्ञान का Digital Temple
          </Badge>
        </section>

        {/* Project Information */}
        <section className="mb-16">
          <Card className="indo-card">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-indo-secondary mb-4">About IndoGyaan</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                An Indian knowledge and culture–inspired blog platform
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
                IndoGyaan is more than just a blog platform - it's a digital temple of knowledge that bridges 
                the ancient wisdom of India with modern technology. Our mission is to preserve, share, and 
                celebrate the rich cultural heritage and knowledge systems of India while making them accessible 
                to the global digital community.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Team Members */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center text-indo-secondary mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="indo-card hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-2xl">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-2xl font-bold text-indo-secondary">{member.name}</CardTitle>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {member.icon}
                    <span className="text-lg font-semibold text-indo-primary">{member.role}</span>
                  </div>
                  <Badge variant="outline" className="text-indo-accent border-indo-accent">
                    ID: {member.idNumber}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center mb-6 leading-relaxed">
                    {member.description}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-indo-secondary mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Key Responsibilities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {member.responsibilities.map((responsibility, index) => (
                        <Badge key={index} variant="secondary" className="bg-indo-accent/10 text-indo-accent">
                          {responsibility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission Statement */}
        <section className="mb-16">
          <Card className="indo-card bg-gradient-to-r from-indo-primary/5 to-indo-accent/5">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-indo-secondary mb-4">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
                To create a digital platform that honors the timeless wisdom of Indian culture while embracing 
                modern technology. We believe that knowledge should be accessible, engaging, and meaningful - 
                connecting the past with the present to build a better future.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Technology Stack */}
        <section>
          <Card className="indo-card">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-indo-secondary mb-4">Technology Stack</CardTitle>
              <CardDescription className="text-lg">
                Built with modern technologies for optimal performance and user experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="p-4 rounded-lg bg-indo-primary/10">
                  <h4 className="font-semibold text-indo-secondary mb-2">Frontend</h4>
                  <p className="text-sm text-gray-600">React, TypeScript, Tailwind CSS</p>
                </div>
                <div className="p-4 rounded-lg bg-indo-accent/10">
                  <h4 className="font-semibold text-indo-secondary mb-2">Backend</h4>
                  <p className="text-sm text-gray-600">Node.js, Express, MongoDB</p>
                </div>
                <div className="p-4 rounded-lg bg-indo-primary/10">
                  <h4 className="font-semibold text-indo-secondary mb-2">Database</h4>
                  <p className="text-sm text-gray-600">MongoDB, Mongoose</p>
                </div>
                <div className="p-4 rounded-lg bg-indo-accent/10">
                  <h4 className="font-semibold text-indo-secondary mb-2">Deployment</h4>
                  <p className="text-sm text-gray-600">Vite, Local Development</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Team;
