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
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    /** General algorithm (first attempt, could be better optimized, generally runs in linear
     * time except for calls to Collections.disjoint() in the getAllRelevantEvents() method): 
     * 1. Get a list of all of the events which actually concern the attendees of the request.
     * 2. Sort the list by start time.
     * 3. Loop through, and find all available times "between" these events; requires some amount
     * of shifting around bounds to deal with edge cases regarding nested events.
     * 4. Return a list of these times, only adding a time if it is longer than the proposed
     * duration of the MeetingRequest. 
     */

  	Collection<Event> relevantEvents = getAllRelevantEvents(events, request);
    List<TimeRange> busyTimes = getSortedTimeRanges(relevantEvents);
    return getComplementTimes(busyTimes, request);
  }

  /**
   * Returns a Collection of only those events which have
   * attendees specified in the request parameter.
   */
  private Collection<Event> getAllRelevantEvents(Collection<Event> events, MeetingRequest request) {
    Collection<String> attendees = request.getAttendees();
    Collection<Event> relevantEvents = new HashSet<>();
    for (Event event : events) {
      Collection<String> eventAttendees = event.getAttendees();
      if (!Collections.disjoint(attendees, eventAttendees)) {
        relevantEvents.add(event);
      }
    }
    return relevantEvents;
  }

  /**
  * Returns a sorted (by start time) List<TimeRange> representing the Collection of events
  * passed as a parameter. 
  */
  private List<TimeRange> getSortedTimeRanges(Collection<Event> events) {
    List<TimeRange> times = new ArrayList<>();
    for (Event event : events) {
      times.add(event.getWhen());
    }
    Collections.sort(times, TimeRange.ORDER_BY_START);
    return times;
  }

  /** Returns a Collection of only those times which do not overlap with any TimeRange in times */
  private Collection<TimeRange> getComplementTimes(List<TimeRange> times, MeetingRequest request) {
    Collection<TimeRange> complementTimes = new ArrayList<>();
    if (times.size() == 0) {
      if (proposedTimeIsLongEnough(TimeRange.WHOLE_DAY, request)) {
        complementTimes.add(TimeRange.WHOLE_DAY);
      }
      return complementTimes;
    }
    // Add any time before the first event in the list
    if (! (TimeRange.START_OF_DAY == times.get(0).start())) {
      TimeRange proposedSlot = TimeRange.fromStartEnd(TimeRange.START_OF_DAY, times.get(0).start(), false);
        if (proposedTimeIsLongEnough(proposedSlot, request)) {
          complementTimes.add(proposedSlot);
        }
    }
    int i;
    int next;
    for (i = 0, next=i+1; next < times.size(); i++, next++) {
      // If there is any space between the current time and the next time, add it to the list
      // Otherwise, keep current time the same until the "next" event is one not entirely contained in the current one 
      if (!times.get(i).overlaps(times.get(next))) {
        TimeRange proposedSlot = TimeRange.fromStartEnd(times.get(i).end(), times.get(next).start(), false);
        if (proposedTimeIsLongEnough(proposedSlot, request)) {
          complementTimes.add(proposedSlot);
        }
      } else if (times.get(i).contains(times.get(next))) {
        i--;
        continue;
      }
      // Reset next to be event directly following current one, if next is not nested within the current event
      next = i+1;
    }
    // Add any time after the last time
    if (! (TimeRange.END_OF_DAY == times.get(i).end())) {
      TimeRange proposedSlot = TimeRange.fromStartEnd(times.get(i).end(), TimeRange.END_OF_DAY, true);
      if (proposedTimeIsLongEnough(proposedSlot, request)) {
        complementTimes.add(proposedSlot);
      }
    }
    return complementTimes;
  }

  private boolean proposedTimeIsLongEnough(TimeRange proposedTime, MeetingRequest request) {
    return proposedTime.duration() >= request.getDuration();
  }
	
}
