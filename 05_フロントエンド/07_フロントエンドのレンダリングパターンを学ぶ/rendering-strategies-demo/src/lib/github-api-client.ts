export type GithubRepoAPIResponse = {
  id: number
  stargazers_count: number
  full_name: string
}

export const getRepoData = async (repoName: string): Promise<GithubRepoAPIResponse> => {
  const result = await fetch("https://api.github.com/repos/" + repoName)
  return result.json() as Promise<GithubRepoAPIResponse>
}
