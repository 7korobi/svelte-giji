import type { Folder, Story } from '../map-reduce'
import { Folders } from '../map-reduce'

export function story_with_folder(stories: Story[] = []): [Story, Folder][] {
  return stories.map((story) => {
    const folder = Folders.find(story.folder.toLowerCase() as Folder['_id'])
    return [story, folder]
  })
}
