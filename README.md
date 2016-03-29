#blocks that move.

Blocks that move is a bullet-hell dodging style game, merging bullet dodging games like Ikuruga or Tohou games and modern day flat design aesthetics. I built this game as my first project in of General Assembly's Web Development Immersive programme.



##Playing blocks that move.

Playing blocks that move is simple. Use your arrow keys or WSAD to move the blue block, and
#####Dodge red bullets
#####Collect gold karma

Points are gained the longer you stay alive, and the more karma you collect, the faster you gain points. The karma bonus goes up to a maximum of 10x, so sometimes it's worth the risk to get that gold karma block.

There are two modes to the game, selectable at the top right hand corner- Challenge mode and Endless.

In Challenge mode, your aim is to achieve a certain amount of points to progress to the next level, where you'll face more, faster, and bigger red boxes. There are 4 levels, but the last level is a true challenge of your reactions and planning.

In Endless mode, you set the difficulty of the game, and then see how many points you can gain.

##Technologies used
+ Javascript and JQuery
+ HTML
+ CSS

##Design aims

The assignment was to:

- Create a game in Javascript, HTML and CSS
- It has to be either playable by two players, or has random element that introduced replayability

##Technical and Design Choices

I chose a bullet hell game because of the complexity of collision mechanics, and my own personal fondness for dexterity based arcade games. After experimenting with colours and sounds I decided a design emphasising white space, using sans-serif fonts and primary colours would give a much more positive experience. In particular,  modern day flat design and 20th century modern artist Piet Mondrian influenced my design and color choices.

While using HTML canvas or using dedicated Javascript game-making libraries may have provided a more elegant animation and collision solution, I chose instead to use purely Javascript and CSS to demonstrate technical skill.

While the gameplay is quite simple, many minor tweaks to the game system was implemented to make it 'feel' more friendly.

###Collision and health

As the blocks all have hard edges by design, collision between block corners tend to be very unforgiving to the player. Not only that, but as collision is calculated per animation frame, having a single block pass through the player results in multiple collisions.

Instead of making the player position reset or restart the level on every collision, which would be jarring to player experience, I added a collision counter and a damage threshold to the player. It now takes about 3 frames of collision before damage is registered, reducing the harshness of absolute collision between squares, and also allows a refractory invulnerability period after collision.

###Randomisation of enemies

Making an endless mode and creating randomised enemies was an early design decision. To introduce a level of replayability, I made all my enemy generation, enemy speed, and level score goals dependent on variables as opposed to fixed values from the onset. This means that while there are only 4 levels currently in the game for demonstration purposes, adding levels is very simple.

###Karma and reward systems 

While the game is quite fun without karma, I decided that adding a reward system to the game would add an extra level of tension and fun. Visually, karma was designed to look appealing, and provide clear positive auditory and visual feedback to the player. A bar was added simply to help reinforce the positive feedback, and karma decay was introduced to maintain tension of collecting the gold karma.

###Abandoned ideas

Original designs of the game included a second screen that would require the player to click coloured boxes in order to spawn karma on the other screen. In early play-testing, the added functionality proved too challenging and made the game too inaccessible and complex for most people.

Another idea that was tested enabled the player to attack the red boxes. This incentivised aggressive play from the player, and thematically did not fit with the light hearted friendly theme of the game, so it too was abandoned in favour of keeping the game thematically consistent.

##Resources
Music is from Music : Pamgaea Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 3.0 License
http://creativecommons.org/licenses/by/3.0/

SFX from http://www.freesfx.co.uk