//
/**
 * Function requirements
 * - Play a song by its ID
 * - Skip to the next song
 * - Maintain the current state of the player (playing or paused)
 *
 * Non-functional requirements
 * - Ensure type safety using TypeScript features
 * - Encapsulate player state management
 * - Provide clear interfaces for song and playlist structures
 * - Ensure separation of concerns within the codebase
 *
 * Design requirements
 * - Use interfaces to define the structure of songs and playlists
 * - Implement a class for the music player that adheres to the defined interfaces
 * - Use types and type aliases to manage player states
 * - Encapsulate the song queue management within a separate class
 *
 * Entities
 * - Song
 * - Playlist
 * - Music Player
 * - Song Queue
 *
 *
 *
 */
namespace MusicPlayer {
  type ResultSet = { ok: true; song: Song } | { ok: false; reason: string };
  interface Song {
    id: string;
    title: string;
    artist: string;
    duration: number; // duration in seconds
  }

  interface Playlist {
    name: string;
    songs: Song[];
  }

  interface IMediaPlayer {
    play: (songId: string) => void;
    prev: () => void;
    next: () => void;
  }

  interface ISongQueue {
    enqueue: (song: Song) => void;
    enqueueMany: (songs: Song[]) => void;
    remove: (songId: string) => boolean;
    clear: () => void;
    next: () => ResultSet;
    prev: () => ResultSet;
    getCurrentSong: () => Song | null;
    setCurrentSongById: (songId: string) => void;
  }

  type PlayState = "playing" | "paused";

  class SongQueue implements ISongQueue {
    #currentIndex: number = -1;
    #queue: Song[] = [];

    getCurrentSong(): Song | null {
      return this.#queue[this.#currentIndex];
    }

    setCurrentSongById(songId: string) {
      const songIndex = this.#queue.findIndex((song) => song.id === songId); // O(n) search

      if (songIndex < 0) {
        console.error(`Song with ID ${songId} not found in queue`);
        return;
      }

      this.#currentIndex = songIndex;
    }

    enqueue(song: Song) {
      this.#queue.push(song);
    }

    enqueueMany(songs: Song[]) {
      this.#queue.push(...songs);
    }

    remove(songId: string): boolean {
      const songIndex = this.#queue.findIndex((song) => song.id === songId);
      if (songIndex < 0) {
        return false;
      }
      const deletedSong = this.#queue.splice(songIndex, 1);
      console.log(`Removed song ${deletedSong[0].title} from queue`);

      return true;
    }

    clear() {
      this.#queue = [];
      this.#currentIndex = -1;
    }

    next(): ResultSet {
      const isQueueEnd = this.#currentIndex + 1 >= this.#queue.length; // out of bounds

      if (isQueueEnd) {
        console.log("Reached end of queue, cannot go next");
        return { ok: false, reason: "Reached end of queue" };
      }
      ++this.#currentIndex;
      return { ok: true, song: this.#queue[this.#currentIndex] };
    }

    prev(): ResultSet {
      const isQueueStart = this.#currentIndex === 0 || this.#currentIndex < 0; // out of bounds
      if (isQueueStart) {
        console.log("At the start of the queue, cannot go back");
        return { ok: false, reason: "At the start of the queue" };
      }
      --this.#currentIndex;
      return { ok: true, song: this.#queue[this.#currentIndex] };
    }
  }

  class MusicPlayer implements IMediaPlayer {
    currentSong: Song | null = null;
    #isPlayState: PlayState = "paused";
    #songs: Map<string, Song> = new Map<string, Song>();
    #songQueue: SongQueue;

    constructor(songs: Map<string, Song>, songQueue: SongQueue) {
      this.#songs = songs;
      this.#songQueue = songQueue;
    }

    isPlaying(): boolean {
      return this.#isPlayState === "playing";
    }

    /**
     *
     * if user clicks playOrPause,
     * we need to know if song is already playing
     */
    play(songId: string): { ok: boolean; reason?: string } {
      const newSong: Song | undefined = this.#songs.get(songId);
      if (!newSong) {
        console.error("Could not find song");
        return { ok: false, reason: `Could not find song ${songId}` };
      }

      this.#updatePlayState(songId, newSong);

      console.log(
        `Now ${this.#isPlayState} song: ${newSong.title} by ${newSong.artist}`
      );

      return {
        ok: true,
        reason: `song ${newSong.title} is ${this.#isPlayState}`,
      };
    }

    #updatePlayState(songId: string, newSong: Song) {
      this.#isPlayState = this.isPlaying() ? "paused" : "playing";

      if (this.currentSong?.id !== songId) {
        this.currentSong = newSong;
        this.#songQueue.setCurrentSongById(songId);
      }
      // TODO sync play state with song queue
    }

    prev(): boolean {
      const resultSet = this.#songQueue.prev();

      if (!resultSet.ok) {
        console.error(
          `Could not go back to previous song: ${resultSet.reason}`
        );
        return false;
      }

      const prevSong = resultSet.song;

      console.log(`Reverting to previous song ${prevSong.title}`);
      return this.play(prevSong.id).ok;
    }

    next(): boolean {
      const resultSet = this.#songQueue.next();

      if (!resultSet.ok) {
        console.error(`Could not skip song: ${resultSet.reason}`);
        return false;
      }

      const nextSong = resultSet.song;

      console.log(`Playing next song ${nextSong.title}`);
      return this.play(nextSong.id).ok;
    }
  }
}
