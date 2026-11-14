# Flashpoint: deploy in about 10 minutes

1. Get an API key: console.anthropic.com > API keys. Add a few dollars of credit and set a monthly spend limit.
2. Put this folder in a new GitHub repository (index.html and the api folder must be at the top level).
3. Go to vercel.com, sign up with GitHub, click Add New > Project, import the repository, then Deploy.
4. In the Vercel project: Settings > Environment Variables. Add ANTHROPIC_API_KEY with your key. Then Deployments > Redeploy.
5. Open the your-project.vercel.app link in a private window and test the Ask AI panel. That link is what you submit.

No GitHub? On vercel.com you can also drag this folder into the dashboard, or run `npx vercel` in the folder.
