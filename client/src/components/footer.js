import React from 'react'
import { Link, Stack, Typography, Divider, Box } from '@mui/material'
import { Linkedin } from 'lucide-react' 

const Footer = () => {
    // Placeholder LinkedIn URLs
    const ANAS_LINKEDIN = "https://www.linkedin.com/in/mohd-aanas";
    const MAYUR_LINKEDIN = "https://www.linkedin.com/in/mayur-sehgal/";

    const DeveloperCredit = ({ name, linkedinUrl }) => (
        <Stack 
            direction="row" 
            alignItems="center" 
            spacing={0.5}
            // Added slight hover effect for better interactivity
            sx={{
                '&:hover .dev-name': { 
                    textDecoration: 'underline', 
                    color: '#B3E5FC' // Light blue highlight on hover
                }
            }}
        >
             <Link 
                href={linkedinUrl}
                target="_blank"
                rel='noreferrer'
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'opacity 0.2s, transform 0.2s',
                    '&:hover': {
                        opacity: 0.7,
                        transform: 'translateY(-1px)' // Subtle lift effect
                    }
                }}
            >
            <Typography 
                className="dev-name"
                color="white" 
                fontSize="14px" 
                fontWeight="medium"
                sx={{ transition: 'color 0.2s' }}
            >
            {name}
            </Typography>
           
                {/* Changed size slightly for better alignment */}
                <Linkedin size={16} color="#B0BEC5" /> {/* Lighter icon color for contrast */}
            </Link>
        </Stack>
    );

    return (
        <Stack width="100%"> 
            <Box
                width="100%"
                // Enhanced styling with a dark, professional background and subtle shadow
                sx={{ 
                    backgroundColor: '#1C2E4A', // Deep Navy Blue
                    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.2)', // Subtle top shadow
                    minHeight: '120px' // Slightly increased height for visual weight
                }} 
                py={{ xs: '20px', md: '30px' }}
                px={{ xs: '20px', md: '80px' }} // Increased horizontal padding for wider screens
                component={Stack}
                justifyContent="center"
            >
                {/* COPYRIGHT SECTION */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={{ xs: 1, sm: 0 }}
                    sx={{ pb: 1 }}
                >
                    <Typography
                        fontSize="14px"
                        fontWeight="light"
                        color="#B0BEC5" // Soft white color for better readability
                    >
                        © 2025 All Rights Reserved
                    </Typography>
                </Stack>
                
                {/* VISUAL SEPARATOR */}
                <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                
                {/* DEVELOPER CREDITS SECTION */}
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 1, md: 4 }}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ pt: 1 }}
                >
                    <Typography color="#90CAF9" fontSize="14px" fontWeight="bold">
                        Made with ❤️ by:
                    </Typography>
                    
                    <DeveloperCredit name="Mohd Aanas" linkedinUrl={ANAS_LINKEDIN} />
                    <DeveloperCredit name="Mayur Sehgal" linkedinUrl={MAYUR_LINKEDIN} />
                </Stack>
            </Box>
        </Stack>
    )
}

export default Footer
