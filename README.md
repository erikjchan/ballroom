[Google Drive Files](https://drive.google.com/drive/u/1/folders/0B_QgKIp964MaRkFIa2RBTE10OEU)

To set up database, run `psql -U postgres -d postgres -1 -f <path/to/db.sql>`

# Background
The client describes the goals of the project as follows:

"There are dozens of collegiate level ballroom dance competitions that happen throughout the year. The aim of this project is to develop a system to manage these competitions. At present, the standard way (if not only way) to organize and manage the competition is through a service called o2cm. The interface is a nightmare for those hosting as well as those signing up.

"Cornell hosts a ballroom competition in the Fall. If the project is polished enough by the beginning of the Fall semester, we would be super excited to use it. The people who work with us that help host different competitions will probably see this implementation and bring it to the other competitions they host year-round."

# Project Summary
Once a competition starts, there are several rounds of dancing, where about 20 couples dance on the floor. Judges walking around have to write down the numbers of the couples that they want to call back to the next round. At present, this is done with paper and pen, and someone has to take the time to enter all the numbers by hand. There are only a few minutes and lots of numbers to enter in before the next round starts. The system tallies them up and figures out who should be moving on to the next round. These results then need to be displayed on a projector so dancers can see if they made it or not.

The system needs to serve three categories of users and support them with a good back end to keep track of everything.

* Competitors
	* Easy interface for competitors to register
	* Lead/follow, different partners
	* Way to see schedule of event
	* See callbacks
* Organizer
	* Easy interface to look at competitors by school, event, how much they owe
	* Definable limits on what events a competitor can register for
	* Time based changing of prices for registration/deadlines
	* Define events (e.g., Newcomer Tango vs PreChamp Tango)
* Judges
	* App for their phone (or accessible web site) to easily tap their callbacks
	* Display how many couples need to be called back from how many rounds
