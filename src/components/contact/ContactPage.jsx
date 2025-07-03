// components/contact/ContactPage.jsx
import PageLayout from '../shared/PageLayout';
import { Mail, Github, Linkedin, ExternalLink, MessageSquare, Phone } from 'lucide-react';

export default function ContactPage() {
    return (
        <PageLayout
            title="Get In Touch"
            subtitle="Let's connect and build something amazing together"
            color="pink"
        >
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="bg-gray-900/50 border border-pink-500/30 rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-pink-400 mb-6">Contact Information</h2>

                    <div className="space-y-6">
                        <a
                            href="mailto:tcornett.dev@gmail.com"
                            className="flex items-center gap-4 p-4 bg-pink-900/20 border border-pink-700 rounded-lg hover:bg-pink-800/20 transition-colors group"
                        >
                            <div className="p-2 bg-pink-600 rounded-lg group-hover:bg-pink-500 transition-colors">
                                <Mail className="text-white" size={20} />
                            </div>
                            <div>
                                <h3 className="text-pink-300 font-semibold">Email</h3>
                                <p className="text-gray-300">tcornett.dev@gmail.com</p>
                            </div>
                        </a>

                        <a
                            href="https://github.com/corneth"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 bg-pink-900/20 border border-pink-700 rounded-lg hover:bg-pink-800/20 transition-colors group"
                        >
                            <div className="p-2 bg-pink-600 rounded-lg group-hover:bg-pink-500 transition-colors">
                                <Github className="text-white" size={20} />
                            </div>
                            <div>
                                <h3 className="text-pink-300 font-semibold">GitHub</h3>
                                <p className="text-gray-300">github.com/corneth</p>
                            </div>
                        </a>

                        <a
                            href="https://linkedin.com/in/corneth"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 bg-pink-900/20 border border-pink-700 rounded-lg hover:bg-pink-800/20 transition-colors group"
                        >
                            <div className="p-2 bg-pink-600 rounded-lg group-hover:bg-pink-500 transition-colors">
                                <Linkedin className="text-white" size={20} />
                            </div>
                            <div>
                                <h3 className="text-pink-300 font-semibold">LinkedIn</h3>
                                <p className="text-gray-300">Professional Profile</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Let's Collaborate */}
                <div className="bg-gray-900/50 border border-pink-500/30 rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-pink-400 mb-6">Let&apos;s Collaborate</h2>

                    <p className="text-gray-300 mb-6">
                        I&apos;m always interested in discussing new opportunities, innovative projects,
                        and potential collaborations. Whether you have a specific project in mind
                        or just want to connect, I&apos;d love to hear from you.
                    </p>

                    <div className="space-y-4">
                        <h3 className="text-pink-300 font-semibold mb-3">What I can help with:</h3>
                        <div className="grid gap-3">
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                                <span>Full-stack web application development</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                                <span>AI and machine learning consulting</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                                <span>Mobile app development (iOS/Android)</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                                <span>Computer vision and image processing</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                                <span>Technical mentoring and code reviews</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                                <span>Architecture design and technical planning</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Response Time */}
            <div className="mt-12 bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-pink-400 mb-4">Quick Response Guarantee</h2>
                <p className="text-gray-300 mb-6">
                    I typically respond to emails within 24 hours during business days.
                    For urgent matters, feel free to reach out via LinkedIn for faster communication.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <div className="flex items-center gap-2 text-pink-300">
                        <MessageSquare size={20} />
                        <span>24hr Email Response</span>
                    </div>
                    <div className="flex items-center gap-2 text-pink-300">
                        <Phone size={20} />
                        <span>Available for Calls</span>
                    </div>
                </div>
            </div>

            {/* Download Resume */}
            <div className="mt-8 text-center">
                <a
                    href="https://docs.google.com/document/d/1ystvTtgyU2f0yw8zmjneIEZKWFiIEBe4/edit?usp=drive_link&ouid=113656033253577938068&rtpof=true&sd=true"
                    download
                    className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                    Download Resume
                    <ExternalLink size={18} />
                </a>
            </div>
        </PageLayout>
    );
}