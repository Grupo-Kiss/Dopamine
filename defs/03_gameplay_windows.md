# Gameplay Windows Specification

## Purpose

This document defines every gameplay window.

Each window is an independent gameplay system.

Windows never pause.

Windows never block each other.

Every window continuously competes for the player's attention.

The player decides how attention is distributed.

---

## Global Window Rules

Every gameplay window must define:

- Purpose
- Passive Behavior
- Active Behavior
- Attention Requests
- Player Actions
- Reward Rules
- Visual States
- Audio States

Every window operates independently.

Every window may simultaneously request attention.

The game never guarantees that only one window requires attention.

Every window has keyboard shortcuts for key actions

Keyboard shortcuts are defined in Gameplay Core.

---

## Common Window States

Every gameplay window can exist in one of the following states.

### Normal

Default operating state.

The window continuously produces content.

The player may freely interact.

Normal interactions grant:

- Score
- Dopamine
- Focus Chain progression

No special bonuses are active.

---

### Focus Ready

The window has recovered from its Reward Cooldown.

It now offers increased rewards.

Interacting while Focus Ready grants additional:

- Dopamine
- Score
- Focus Chain quality

The player is never explicitly informed.

Instead, the window communicates this state through subtle visual language.

Examples:

- brief shimmer
- soft border glow
- tiny particle burst
- gentle pulse

The player should naturally learn to recognize these indicators after repeated play.

---

### Active

The player is currently interacting with this window.

The window continuously evaluates player actions.

Reward Cooldown begins immediately after leaving this state.

---

### Waiting

The player recently left this window.

Reward Cooldown is active.

Returning immediately is allowed.

However, rewards are temporarily reduced.

Waiting automatically transitions to Focus Ready once Reward Cooldown expires.

---

### Attention Request

A temporary opportunity requiring immediate attention.

The window is actively asking for interaction.

Examples:

- new content
- limited reward
- special event
- opportunity
- boss
- mention

Attention Requests should never permanently remain on screen.

Each request expires after a configurable duration.

Responding before expiration grants significantly larger rewards.

Ignoring requests is allowed.

Ignoring the request carries no direct punishment.

The player simply loses the opportunity.

---

## Reward Philosophy

Every window grants Dopamine.

Every window grants Score.

Some windows also contribute to:

- Focus Chain
- Burnout APM
- Combo
- Special Bonuses

Windows never directly remove Dopamine.

Failure comes from missing opportunities while passive Dopamine drain continues.

---

# Minigame Window

## Purpose

Primary gameplay activity.

Largest gameplay window.

Always visible.

One randomly selected minigame remains active for the entire match.

The selected minigame never changes until Game Over.

---

## Passive Behavior

The game continues running continuously.

The player is never required to stop interacting.

Difficulty continuously increases.

---

## Possible Player Actions

Actions depend on the selected minigame.

See:

04_gameplay_minigames.md

---

## Attention Requests

Examples

- Boss appears.
- Rare power-up appears.
- Temporary multiplier.
- Dangerous enemy.
- High-value target.

These events are intentionally more visually dramatic than normal gameplay.

The player should instinctively want to return to the minigame.

---

## Rewards

Every successful gameplay action grants:

- Score
- Dopamine
- APM contribution

Bosses additionally grant:

- Large Dopamine
- Large Score
- Combo Bonus

The minigame must never permanently end.

If the player fails the current minigame:

- immediately restart that minigame
- preserve every other gameplay window
- preserve Dopamine
- preserve Score
- preserve Difficulty
- preserve Focus Chain whenever possible

Only the internal state of the minigame resets.

The player should experience failure as another interruption competing for attention rather than a Game Over.

---

## Visual State

The minigame should always feel active.

Particles.

Movement.

Projectiles.

Animations.

Never visually static.

---

## Audio

Continuous gameplay audio.

Momentary reward sounds.

Boss music overlays when applicable.

---

# Loop Window

## Purpose

Loop represents an endless stream of short-form vertical videos.

Its purpose is to provide rapid, highly rewarding interactions that encourage compulsive content consumption.

Loop should constantly tempt the player away from every other gameplay window.

---

## Visual Composition

The window displays a single vertical video.

Visible UI elements include:

- creator avatar
- title
- hashtags
- like count
- comment count
- share button
- progress indicator

The layout should resemble modern short-form video platforms without reproducing any identifiable brand.

The interface should feel immediately familiar while remaining legally distinct.

---

## Passive Behaviour

The current video continuously loops.

Videos never automatically advance.

The player must actively decide when to consume new content.

As a video remains on screen, its reward value gradually decreases.

After a configurable amount of time, the window transitions into the Focus Ready state.

This represents the player's subconscious desire for novelty.

The longer the player ignores new content, the stronger the desire to switch videos becomes.

---

## Active Behaviour

Whenever the player interacts, the window immediately responds with satisfying visual feedback.

Interactions should feel nearly instantaneous.

The player should never wait for network responses.

---

## Possible Player Actions

### Next Video

Advances to the next video.

This is the primary interaction of the window.

Rewards:

- Dopamine
- Score

Additional rewards depend on:

- current Focus Chain
- Focus Ready state
- active Interactive Opportunities

Advancing from a Focus Ready state grants significantly higher rewards.

Repeatedly advancing too quickly eventually produces diminishing returns.

---

### Like

The player may repeatedly Like the current video.

Every Like grants Dopamine.

However, each consecutive Like on the same video provides progressively smaller rewards.

The reward approaches zero asymptotically.

Changing to another video immediately resets Like efficiency.

This mechanic intentionally imitates compulsive repetitive interactions while naturally encouraging novelty.

---

### Repost

Instantly republishes the current video.

No confirmation dialog appears.

No recipient selection exists.

The action represents impulsive content sharing.

Rewards:

- Dopamine
- Score

Reposts also increase the probability of future engagement events inside Loop.

---

## Passive Events

Examples:

A funny video appears.

A controversial video appears.

A highly satisfying video appears.

A conspiracy video appears.

A ragebait video appears.

A brainrot trend appears.

Passive Events modify the engagement value of the current content.

They never require interaction.

---

## Interactive Opportunities

Examples:

LIVE NOW

Breaking Trend

Limited Challenge

Creator Reply

Exclusive Clip

These events appear above the current video.

A visible timer begins.

If the player responds before expiration:

Large Dopamine reward.

Large Score reward.

Focus Chain quality bonus.

Special arcade feedback.

If ignored:

The event simply expires.

No direct penalty is applied.

---

## Reward Philosophy

Loop provides frequent but individually small rewards.

Its strength comes from frequency.

The player should feel tempted to check Loop often rather than remain inside it.

Long uninterrupted sessions inside Loop become progressively less efficient because Reward Cooldown and Focus Chain mechanics encourage attention redistribution.

---

## Difficulty Scaling

Difficulty never changes player controls.

Instead it increases:

- frequency of premium videos
- frequency of Interactive Opportunities
- probability of ragebait
- number of engagement events

The window gradually becomes more demanding without becoming mechanically harder.

---

## Focus Chain Behaviour

Loop works especially well as a transition window.

Its short interaction cycle makes it an efficient connector between larger activities.

Example:

Minigame

↓

Loop

↓

Pulse

↓

Wave

↓

Minigame

This naturally encourages long Focus Chains.

Loop is the fastest window to naturally enter the Focus Ready state.

Because videos continuously repeat, Focus Ready opportunities occur frequently.

Experienced players should naturally use Loop as one of the primary windows for maintaining long Focus Chains.

---

## Burnout Behaviour

During Burnout:

- visual effects intensify
- reward feedback becomes exaggerated
- interaction rewards increase according to Burnout multipliers

The underlying interaction rules never change.

---

## Visual Feedback

Every interaction should produce immediate arcade feedback.

Examples:

- floating score
- floating Dopamine
- particles
- icon burst
- brief scale animation
- satisfying flash

Focus Ready state should additionally produce its subtle visual indicator.

Attention Requests should appear impossible to ignore.

They should visually dominate the window without obscuring the video itself.

---

## Audio Feedback

Every interaction plays short, satisfying feedback.

Special opportunities use stronger sounds.

Attention Requests use distinct alert sounds.

No sound should resemble an existing commercial platform.

---

## Failure Cases

Remaining inside Loop for extended periods is allowed.

However:

- rewards become less efficient
- Focus Chain opportunities elsewhere become increasingly valuable

The player is gently encouraged to leave rather than punished for staying.

---

## Acceptance Criteria

The implementation satisfies this specification if:

- videos continue automatically
- every interaction feels instantaneous
- premium opportunities clearly attract attention
- Focus Ready can be recognized through repeated play
- the player naturally alternates between Loop and other windows instead of remaining permanently inside it


# Pulse Window

## Purpose

Pulse represents a fictional microblogging social network.

Its purpose is to simulate the addictive mechanics of online discussion:

- trends
- outrage
- validation
- engagement farming
- social comparison
- notifications

Pulse is the primary text interaction system.

The player is encouraged to participate in conversations that maximize engagement rather than meaningful communication.

---

## Visual Composition

Pulse displays:

- timeline
- trending topics
- engagement counters
- user profile
- writing area

The interface should resemble a modern social network without copying any existing platform.

No recognizable logos.

No existing branding.

---

## Passive Behaviour

The timeline continuously updates.

New posts appear periodically.

Posts are generated from predefined content templates.

Content categories include:

- harmless trends
- absurd debates
- ragebait
- memes
- controversial opinions
- fake news
- internet drama
- advertising
- spam

Not every post is valuable.

The player must identify opportunities.

### Advertising and Spam:
Advertising and Spam are filler content.

They intentionally imitate low-value internet noise.

They do not provide Dopamine rewards.

They exist to:

- increase information density
- create distraction
- compete for attention
- satirize online environments

They should not become optimal interactions.

---

## Active Behaviour

The player can:

- read posts
- interact
- write posts
- reply
- follow trends

Interactions produce different engagement values.

---

## Possible Player Actions

### Like

The player likes a post.

Effects:

- immediate small reward
- engagement contribution

Repeated likes on the same post follow Diminishing Returns.

---

### Repost

The player republishes a post.

No additional menu appears.

No user selection exists.

The action happens instantly.

Effects:

- score
- dopamine
- increases visibility

---

### Reply

The player writes a response to a post.

This is the primary text input mechanic.

The response is evaluated against active trends.

A reply matching an active trend has higher engagement potential.

---

### Create Post

The player writes their own post.

The player may write anything.

The system evaluates:

- active trends
- ragebait keywords
- engagement patterns

Posts without connection to current trends receive limited interaction.

---

### Trend Participation

The player may intentionally join trending conversations.

Successful participation generates:

- likes
- replies
- mentions
- dopamine

---

## Passive Events

Examples:

### Trend Appears

A new topic becomes popular.

Visual indicator appears.

The topic has limited lifetime.

---

### Ragebait Event

A controversial post gains visibility.

The post creates a high engagement opportunity.

Participating generates larger rewards.

---

### Mention Event

Another user mentions the player.

This creates an Attention Request.

The player can respond for additional rewards.

---

### Viral Post

A random post suddenly receives high engagement.

The opportunity expires quickly.

---

## Interactive Opportunities

Examples:

- "Everyone is discussing this"
- "Your post is trending"
- "Someone replied to you"
- "Your opinion is being challenged"

These events require attention before expiration.

Successful response grants:

- large dopamine
- score multiplier
- Focus Chain bonus

---

## Reward Philosophy

Pulse rewards emotional engagement.

High reward situations are intentionally associated with:

- controversy
- urgency
- validation

The satire comes from rewarding behaviors commonly optimized by social platforms.

---

## Focus Chain Behaviour

Pulse is a medium-duration interaction window.

It is valuable because:

- reading requires attention
- writing creates delayed rewards
- mentions create return opportunities

Pulse should frequently create reasons for the player to leave and return later.

---

## Burnout Behaviour

During Burnout:

- engagement counters animate faster
- notifications increase
- reactions appear more frequently

The player should feel socially overwhelmed.

---


## Visual Feedback

Interactions create:

- like counters increasing
- floating engagement numbers
- reaction animations
- notification bursts

High engagement events should feel exaggerated.

Examples:

- hundreds of likes appearing instantly
- fake viral explosion
- dramatic UI movement

---

## Audio Feedback

Examples:

Like:

small reward sound

Viral post:

large arcade reward

Mention:

attention alert

Trend:

rising tension sound

---

## Failure Cases

The player can ignore Pulse completely.

No direct punishment occurs.

The cost is missing engagement opportunities.

---

## Acceptance Criteria

The implementation satisfies this specification if:

- the player can write and publish text
- trends influence engagement
- ragebait creates higher interaction opportunities
- rewards follow Diminishing Returns
- Pulse creates reasons to repeatedly return
- no existing social network branding is used

# Echo Window

## Purpose

Echo represents long-form passive media consumption.

It combines elements of video platforms, podcasts and background entertainment.

Its purpose is to create a slower but persistent attention competitor.

Unlike Loop and Pulse, Echo does not rely on constant interaction.

It creates attachment through continuous consumption.

---

## Visual Composition

Echo displays:

- video player area
- title
- creator information
- description
- engagement counters
- playback controls

The design should resemble generic media players.

No existing platform branding.

---

## Passive Behaviour

Echo content continues playing while the player interacts with other windows.

The player may intentionally ignore Echo.

When a video or podcast segment finishes, the next available content starts immediately.

The transition happens automatically.

Content switching is not considered a primary interaction in Echo.

The player does not receive significant rewards for simply consuming more content.

Echo rewards attention to meaningful events inside the content, not endless skipping.

Long-form content generates occasional engagement opportunities.

Examples:

- interesting moment
- controversial statement
- funny quote
- important timestamp

---

## Active Behaviour

The player may interact with Echo to generate rewards.

Active interactions are limited.

Echo should not become a high-frequency clicker system.

Its role is providing occasional attention opportunities.

---

## Possible Player Actions

### Play / Pause

Controls content playback.

Starting playback provides a small reward.

Repeated toggling follows Diminishing Returns.

---

### Change Content

Changes the current Echo content.

This action exists but is not a primary reward mechanic.

Rewards:

- small Score
- minimal Dopamine

Repeated changes follow Diminishing Returns.

The player should not optimize Echo by constantly changing content.

---

### React

The player selects an emotional reaction.

Examples:

- funny
- interesting
- surprising
- disagree

Reactions create simulated engagement.

---

### Subscribe

Represents committing attention to a creator.

Provides:

- Score
- Dopamine

Only limited rewards per content item.

---

## Passive Events

### Interesting Moment

A segment becomes highlighted.

Example:

"Everyone is talking about this part"

Creates an Attention Request.

---

### Quote Moment

A memorable phrase appears.

The player can react.

---

### Debate Moment

A controversial statement appears.

This can connect Echo with Pulse trends.

---

### Sponsor Segment

A fake advertisement appears.

It creates information noise.

It does not provide Dopamine.

It exists as satire.

---

## Interactive Opportunities

Examples:

- "Everyone reacted to this moment"
- "New discussion started"
- "Creator answered comments"

Successful interaction grants:

- Dopamine
- Score
- Focus Chain bonus

---

## Reward Philosophy

Echo provides lower-frequency but larger attention opportunities.

The player should feel:

"I should check what is happening here"

rather than:

"I need to click constantly."

---

## Focus Chain Behaviour

Echo is a strategic window.

Because it generates fewer but larger opportunities, returning to Echo after checking faster windows can create high-quality Focus Chains.

---

## Burnout Behaviour

During Burnout:

- playback effects intensify
- recommendations appear faster
- engagement indicators increase

The content itself does not accelerate.

---

## Visual Feedback

Interactions create:

- reaction animations
- engagement counters
- highlight effects

Important moments should visually compete with other windows.

---

## Audio Feedback

Audio includes:

- playback audio
- interaction sounds
- event alerts

Playback audio should have lower priority than important gameplay feedback.

---

## Failure Cases

Ignoring Echo is allowed.

The player loses only possible rewards.

No direct punishment exists.

---

## Acceptance Criteria

The implementation satisfies this specification if:

- Echo can continue existing without interaction
- important moments create attention requests
- interactions are less frequent than Loop or Pulse
- Echo provides strategic Focus Chain opportunities
- fake advertising creates noise without rewards

# Alerts System

## Purpose

Alerts represents operating system style notifications.

Unlike other gameplay windows, Alerts does not occupy a permanent layout position.

Alerts appear above the entire interface.

Alerts are the only element allowed to visually overlap other windows.

Their purpose is to create interruption and urgency.

---

## Visual Composition

Alerts appear as floating notification cards.

They may appear:

- top center
- top right
- edge positions

depending on device layout.

Alerts must remain visible without completely blocking gameplay.

The visual style should resemble familiar device notifications without copying any existing operating system.

---

## Behaviour

Alerts are generated independently from all windows.

They can appear at any moment.

The player may:

- interact immediately
- ignore them
- return later if still available

Alerts have expiration timers.

---

## Alert Categories

### Social Alerts

Generated from Pulse.

Examples:

- someone liked your post
- someone mentioned you
- someone replied

Rewards:

- Dopamine
- Score
- possible Focus Chain bonus

---

### Media Alerts

Generated from Loop, Echo and Wave.

Examples:

- new recommended content
- trending audio
- popular discussion

Rewards vary depending on urgency.

---

### Fake System Alerts

Designed as satire.

Examples:

- storage almost full
- update available
- suspicious activity detected
- battery warning

These create distraction.

Some provide rewards.

Some are intentionally useless.

### Standalone Alerts

Alerts that do not redirect the player to another gameplay window.

Their purpose is creating interruption, curiosity or satire.

Examples:

- fake security warnings
- fake achievements
- fake device messages
- useless reminders
- absurd system messages

When opened:

- the alert expands
- displays its result
- grants its defined reward
- disappears

Standalone Alerts never change Active Window.

They may still affect:

- Score
- Dopamine
- Focus Chain

depending on their type.

---

### Spam Alerts

Low-value interruptions.

Examples:

- fake promotions
- fake giveaways
- irrelevant recommendations

Purpose:

Increase cognitive overload.

They provide no Dopamine.

They exist as noise.

---

## Possible Player Actions

### Open Alert

The player interacts with the notification.

If the Alert has a destination:

- the destination window receives focus
- the interaction counts as a Focus Change

If the Alert is standalone:

- no window receives focus
- the alert resolves internally

Rewards depend on alert type.

---

### Dismiss Alert

The player removes the notification.

Usually provides no reward.

Certain fake alerts may provide a small comedic reward.

---

### Ignore Alert

The player does nothing.

After expiration:

- alert disappears
- opportunity is lost

No direct penalty.

---

## Attention Requests

Every Alert is automatically an Attention Request.

However, not every Alert has equal value.

Priority levels:

Low

Normal

High

Critical

Priority affects:

- visual intensity
- sound
- expiration time

---

## Focus Chain Behaviour

Opening an Alert can extend Focus Chain.

Quality depends on:

- alert priority
- destination window state
- timing

Example:

Normal Alert

→ small Focus Chain reward

High Priority Alert

→ large Focus Chain reward

---

## Burnout Behaviour

During Burnout:

- more alerts appear
- expiration times decrease
- visual intensity increases
- multiple alerts may compete simultaneously

The player should feel overwhelmed by demands for attention.

---

## Visual Feedback

Alerts use:

- entrance animation
- notification sound
- urgency indicator
- expiration animation

Critical Alerts may use:

- screen shake
- stronger animation
- larger visual presence

---

## Audio Feedback

Alerts have distinct notification sounds.

Sound priority is higher than normal window audio.

Critical Alerts can temporarily override background audio.

---

## Failure Cases

Ignoring Alerts is allowed.

The player loses only the opportunity.

Alerts must never create unavoidable failure.

---

## Acceptance Criteria

The implementation satisfies this specification if:

- Alerts can appear over any window
- Alerts never affect layout calculations
- Alerts can create Focus Chain opportunities
- Alerts create urgency without becoming mandatory
- Spam creates noise without becoming an optimal strategy


# Wave Window

## Purpose

Wave represents music streaming and background audio consumption.

Its purpose is to create a constant emotional layer while competing for attention through recommendations, discoveries and social validation.

Unlike Loop and Pulse, Wave should require fewer interactions.

It creates passive attachment and occasional high-value opportunities.

---

## Visual Composition

Wave displays:

- abstract generated artwork
- waveform visualization
- track title
- artist name
- playback controls

The interface should resemble a generic music player.

No existing platform branding.

---

## Passive Behaviour

Music is selected randomly from the available music library.

There are no playlists.

The game does not require album artwork or external metadata.

When a track finishes:

- another random track starts immediately
- no user interaction is required

The player may interrupt playback at any moment by skipping.

Wave alternates between two possible behaviors:

- active discovery through skipping
- passive listening while waiting for valuable moments

---

## Active Behaviour

The player may interact with Wave to:

- control playback
- discover music
- react to songs
- manage recommendations

Interactions are intentionally limited.

Wave should alternate between high-frequency discovery moments and passive listening periods.

During discovery:

- rapid skipping is encouraged
- Dopamine increases through anticipation

During passive listening:

- the player is rewarded for waiting
- Song Moments become valuable

The optimal strategy should change over time.

---

## Possible Player Actions

### Playback

Music playback cannot be paused.

The player cannot stop the audio stream.

The only available actions are:

- skip current track
- react to current track
- discover new content

This reinforces the feeling of constant stimulation.

---

### Skip Track

Changes the current song.

Skipping creates a Dopamine Discovery Bonus.

The player receives increasing excitement when searching for a better song.

The bonus follows a logarithmic curve.

Each consecutive skip increases anticipation.

However, the reward gain decreases progressively.

The purpose is simulating:

"Maybe the next one is the perfect song."

The bonus resets when:

- a recommended song is opened
- an Attention Request redirects to a song
- the player stays listening for a significant amount of time

---

### Song Moment

Every song contains a hidden valuable moment.

The moment is randomly generated between:

25%

and

75%

of the song duration.

When playback reaches this moment:

- visual feedback occurs
- Dopamine reward is granted
- Focus Chain quality increases

The player should feel rewarded for staying with a song instead of constantly skipping.

---

### Like Track

Likes the current song.

A song can only be liked once.

The first Like provides:

- Dopamine
- Score

Additional attempts have no effect.

The player must discover new content to receive new Like rewards.

---

### Discover Recommendation

The player accepts a recommendation.

Examples:

- new artist
- trending song
- unexpected genre

Rewards:

- higher Dopamine
- Score bonus

Discovery should feel more valuable than repetition.

---

## Passive Events

### New Recommendation

A new song recommendation appears.

Creates an Attention Request.

---

### Trending Audio

A song becomes popular inside the fictional ecosystem.

May connect with:

- Loop videos
- Pulse trends

---

### Music Moment

A special moment occurs:

Examples:

- chorus starts
- beat drop
- unusual sound

The player may receive an opportunity to interact.

---

### Playlist Update

A playlist changes.

Creates curiosity.

---

## Interactive Opportunities

Examples:

- "Everyone is listening to this"
- "New viral sound discovered"
- "Your recommendation is ready"

Successful interaction grants:

- Dopamine
- Score
- Focus Chain bonus

### Recommended Track

A recommendation can immediately replace the current song.

When accepted:

- current track changes instantly
- Skip Discovery Bonus resets
- large Dopamine reward is granted

The player feels that the system found something valuable for them.

---

## Reward Philosophy

Wave provides lower interaction frequency but continuous presence.

Its purpose is creating background engagement.

The player should feel:

"I should check what is playing"

not:

"I need to constantly click."

---

## Focus Chain Behaviour

Wave creates slower Focus Chain transitions.

Because interactions are less frequent, successful Wave interactions should have higher quality.

Example:

Pulse

↓

Wave discovery

↓

Loop

creates a stronger chain than repeated Loop interactions.

---

## Burnout Behaviour

During Burnout:

- music intensity increases
- visualizers become stronger
- recommendations appear faster

The audio itself should never become painful.

---

## Visual Feedback

Examples:

- waveform animations
- beat reactions
- floating engagement numbers
- recommendation effects

Important moments should create strong but clean feedback.

---

## Audio Feedback

Wave is the main background audio source.

The system must support:

- music playback
- gameplay sound effects
- notification sounds

Audio priority rules belong in `09_game_feel.md`.

---

## Failure Cases

Ignoring Wave is allowed.

The player only loses possible opportunities.

No direct penalty exists.

---

## Acceptance Criteria

The implementation satisfies this specification if:

- music continues automatically
- songs transition without interaction
- skipping is not the optimal strategy
- recommendations create attention opportunities
- Wave contributes to Focus Chain without dominating gameplay