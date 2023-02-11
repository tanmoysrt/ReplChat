import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
} from '@chakra-ui/react'
import { Logo } from '@/components/Logo'
import { useState } from 'react';

export default function Auth() {
    const [showloginForm , setShowLoginForm] = useState(true);

    async function loginUser(){

    }

    async function registerUser(){

    }

    return (
        <Container
            maxW="lg"
            py={{
                base: '12',
                md: '24',
            }}
            px={{
                base: '0',
                sm: '8',
            }}
        >
            <Stack spacing="8">
                <Stack spacing="6">
                    <Logo />
                    <Stack
                        spacing={{
                            base: '2',
                            md: '3',
                        }}
                        textAlign="center"
                    >
                        <Heading
                            size={{
                                base: 'xs',
                                md: 'sm',
                            }}
                        >
                            {
                                showloginForm ? "Log in to ReplChat" : "Join ReplChat Today"
                            }
                        </Heading>
                    </Stack>
                </Stack>
                <Box
                    py={{
                        base: '0',
                        sm: '8',
                    }}
                    px={{
                        base: '4',
                        sm: '10',
                    }}
                    bg={{
                        base: 'transparent',
                        sm: 'bg-surface',
                    }}
                    boxShadow={{
                        base: 'none',
                        sm: 'md',
                    }}
                    borderRadius={{
                        base: 'none',
                        sm: 'xl',
                    }}
                >
                   {
                    showloginForm ?
                        <Stack spacing="6">
                            <Stack spacing="5">
                                <FormControl>
                                    <FormLabel htmlFor="username">Username</FormLabel>
                                    <Input id="username" type="username" />
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <Input id="password" type="password" />
                                </FormControl>      
                            </Stack>
                            <Stack spacing="3">
                                <Button borderRadius="full" variant="solid" colorScheme="blue" onClick={()=>{
                                    loginUser();
                                }}>Sign in</Button>
                                <Button borderRadius="full" variant="outline" colorScheme="blue" onClick={()=>{
                                    setShowLoginForm(false);
                                }}>Create Account</Button>
                            </Stack>
                        </Stack>
                        :  
                        <Stack spacing="6">
                            <Stack spacing="5">
                                <FormControl>
                                    <FormLabel htmlFor="name">Full Name</FormLabel>
                                    <Input id="name" type="name" />
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="username">Username</FormLabel>
                                    <Input id="username" type="username" />
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <Input id="password" type="password" />
                                </FormControl>      
                            </Stack>
                            <Stack spacing="3">
                                <Button borderRadius="full" variant="solid" colorScheme="blue" onClick={()=>{
                                    registerUser();
                                }}>Create Account</Button>
                                <Button borderRadius="full" variant="outline" colorScheme="blue" onClick={()=>{
                                    setShowLoginForm(true);
                                }}>Sign in</Button>
                            </Stack>
                        </Stack>
                   }
                </Box>
            </Stack>
        </Container>
    );
}