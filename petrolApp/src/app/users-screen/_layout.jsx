import { Stack } from "expo-router";

const screens = [
  { name: "about", title: "About" },
  { name: "contact", title: "Contact Support" },
  { name: "FullArticle", title: "Full Article" },
  { name: "privacy", title: "Privacy & Policy" },
  { name: "terms", title: "Terms & Condition" },
  { name: "station-owner-terms", title: "Terms & Conditions" },
  { name: "station-owner", title: "Station Owner" },
  { name: "user-details", title: "Edit User Details" },
  { name: "delete-account", title: "Delete Account" },
  { name: "advert", title: "Adverts" },
  { name: "vendor", title: "Vendor" },
  { name: "vendor-terms", title: "Terms & Conditions" },
  { name: "create-vendor", title: "Create Vendor" },
  { name: "create-ads", title: "Create Your Advert" },
  { name: "AdvertDetails", title: "Advert Details" },
  { name: "webview", title: "Make Payment" },
  { name: "station-orders", title: "Orders" },
  { name: "user-orders", title: "Orders" },
  { name: "place-order", title: "Place Order" },
  { name: "create-station", title: "Register Station" },
  { name: "ArticleDetails", title: "Article Details" },
  { name: "testimonial", title: "Testimonials" },
];

export default function Layout() {
  return (
    <Stack>
      {screens.map(({ name, title }) => (
        <Stack.Screen
          key={name}
          name={name}
          options={{
            title,
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      ))}
    </Stack>
  );
}
