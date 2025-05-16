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
        path:'/faq',
        text:'FAQ'
    },
    {
        path:'/about',
        text:'About'
    },
]

export const navLinksRight: NavItems[] = [
    {
        path:'/contact',
        text:'Contact'
    },
    {
        path:'/book-a-call',
        text:'Book A Call'
    },

]
