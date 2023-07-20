# Flow-ImpactX Web

Flow-ImpactX web app is a [Next.js](https://nextjs.org/) project bootstrapped to serve four main views and allow users to interface with the Flow blochain. Users can mint Flow-ImpactX through an admin view, purchase through an item page, browse the marketplace, and view their Flow-ImpactX on their profile. Users can navigate between these pages through a navigation bar at the top of their screen.

## [Homepage View](pages/index.jsx)
![Homepage](/assets/ImpactX-items-homepage-view.png)
The homepage shows the most recent listings for both the storefront and marketplace.

## [Profile View](pages/profiles/[address].jsx)
![Profile](/assets/ImpactX-items-profile-view.png)
The profile view shows a user both their listed & unlisted Flow-ImpactX. Users can select their Flow-ImpactX here and choose to list them on the marketplace. Users can also view other users' profiles.

## [Marketplace View](pages/marketplace.jsx)
![Marketplace](/assets/ImpactX-items-marketplace.png)
The marketplace view allows individuals to find Flow-ImpactX listed for sale by other users.  

## [Admin minter view](pages/admin/mint.jsx)
![Admin](/assets/ImpactX-items-admin-view.png)
The admin view is where users can mint new NFTs through the Flow-ImpactX minter account. It's open to anybody for demonstration purposes. Flow-ImpactX minted here are automatically put up for sale on the storefront page.