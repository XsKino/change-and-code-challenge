import { User, UsersFour, ReadCvLogo, Star } from "@phosphor-icons/react/dist/ssr"

const config = {
  dashboard: {
    title: "Dashboard",
    navItems: [
      {
        label: "users",
        href: "/dashboard/users",
        icon: User,
        adminOnly: true,
      },
      {
        label: "accounts",
        href: "/dashboard/accounts",
        icon: ReadCvLogo,
        adminOnly: true,
      },
      {
        label: "teams",
        href: "/dashboard/teams",
        icon: UsersFour,
        adminOnly: true,
      },
      {
        label: "profile",
        href: "/dashboard/profile",
        icon: Star,
        adminOnly: false,
      },
    ],
  },
}

export default config
