export interface NavItems {
    text: string;
    path: string;
}

export const navLinks: NavItems[] = [
    {
        path:'/home',
        text:'Home'
    },

    {
        path:'/about',
        text:'About'
    },
]

export const navLinksRight: NavItems[] = [

    {
        path:'/book-call',
        text:'Book A Call'
    },
    {
        path:'/login',
        text:'Login'
    },

]
