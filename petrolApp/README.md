npx expo start --clear

eas build -p android --profile production
eas build -p android --profile development
eas build -p android --profile preview
eas update --channel preview --platform android --message "add price api"

git add petrolApp
git commit -a -m "edit registration logic"
git push petapp main
git push origin main

npx prisma db push
