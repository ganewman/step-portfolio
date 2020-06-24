// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

public final class FindMeetingQuery {

  /** General algorithm (first attempt, could be better optimized, generally runs in linear
   * time except for calls to Collections.disjoint() in the getAllRelevantEvents() method): 
   * 1. Get a list of all of the times when attendees are busy.
   * 2. Sort the list by start time.
   * 3. Loop through, and find all available times "between" these events; requires some amount
   * of shifting around bounds to deal with edge cases regarding nested events.
   * 4. Return a list of these times, only adding a time if it is longer than the proposed
   * duration of the MeetingRequest. 
   */
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    Collection<TimeRange> relevantTimes = getAllRelevantTimes(events, request);
    List<TimeRange> sortedTimes = getSortedTimeRanges(relevantTimes);
    return getNonOverlappingTimes(sortedTimes, request);
  }

  /**
   * Returns a Collection of only those TimeRanges which correspond to events
   * with attendees common to the 'request' parameter.
   */
  private Collection<TimeRange> getAllRelevantTimes(Collection<Event> events, MeetingRequest request) {
    Collection<String> attendees = request.getAttendees();
    Collection<TimeRange> relevantTimes = new HashSet<>(); // Prevent duplicate times.
    for (Event event : events) {
      Collection<String> eventAttendees = event.getAttendees();
      if (!Collections.disjoint(attendees, eventAttendees)) {
        relevantTimes.add(event.getWhen());
      }
    }
    return relevantTimes;
  }

  /**
  * Returns a sorted (by start time) List<TimeRange> representing the Collection of events
  * passed as a parameter. It is necessary to convert to a list for use of the sort() method.
  */
  private List<TimeRange> getSortedTimeRanges(Collection<TimeRange> times) {
    List<TimeRange> sortedTimes = new ArrayList<>(times);
    Collections.sort(sortedTimes, TimeRange.ORDER_BY_START);
    return sortedTimes;
  }

  /** Returns a Collection of only those times which do not overlap with any TimeRange in 'times'. */
  private Collection<TimeRange> getNonOverlappingTimes(List<TimeRange> times, MeetingRequest request) {
    Collection<TimeRange> complementTimes = new ArrayList<>();
    if (times.isEmpty()) {
      addIfProposedTimeIsLongEnough(TimeRange.WHOLE_DAY, request, complementTimes);
      return complementTimes;
    }
    // Add any time before the first event in the list
    if (TimeRange.START_OF_DAY != times.get(0).start()) {
      TimeRange proposedSlot = TimeRange.fromStartEnd(TimeRange.START_OF_DAY, times.get(0).start(), false);
      addIfProposedTimeIsLongEnough(proposedSlot, request, complementTimes);
    }
    int current = 0;
    int next = 1;
    while (next < times.size()) {
      // If there is any space between the current time and the next time, add it to the list
      // Otherwise, keep current time the same until the "next" event is one not entirely contained in the current one 
      if (!times.get(current).overlaps(times.get(next))) {
        TimeRange proposedSlot = TimeRange.fromStartEnd(times.get(current).end(), times.get(next).start(), false);
        addIfProposedTimeIsLongEnough(proposedSlot, request, complementTimes);
      }
    	if (!times.get(current).contains(times.get(next))) {
        current = next;
      }
      next++;
    }
    // Add any time after the last time
    if (TimeRange.END_OF_DAY != times.get(current).end()) {
      TimeRange proposedSlot = TimeRange.fromStartEnd(times.get(current).end(), TimeRange.END_OF_DAY, true);
     	addIfProposedTimeIsLongEnough(proposedSlot, request, complementTimes);
    }
    return complementTimes;
  }

  private void addIfProposedTimeIsLongEnough(TimeRange proposedTime,
  	  MeetingRequest request, Collection<TimeRange> times) {
    if (proposedTime.duration() >= request.getDuration()) {
      times.add(proposedTime);
    }
  }
	
}
