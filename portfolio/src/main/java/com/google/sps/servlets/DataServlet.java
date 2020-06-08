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

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.Gson;
import com.google.sps.data.Comment;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

/**  Servlet that returns user comments. */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    List<Comment> comments = getCommentsFromDatabase();
    String json = convertToJson(comments);
    response.setContentType("text/html;");
    response.getWriter().println(json);
  }

  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String name = request.getParameter("name-input");
    String content = request.getParameter("comment-input");

    // Uses a hidden form to get the page the user sent the request from
    // Allows redirect to work correctly even if comments section is present on multiple pages
    String pageToRedirect = request.getParameter("page-name");
    
    sendCommentToDatabase(name, content);

    response.sendRedirect(pageToRedirect);
  }

  /** Creates a comment entity and sends it to the Datastore database */
  private void sendCommentToDatabase(String name, String content) {
    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("name", name);
    commentEntity.setProperty("content", content);
    commentEntity.setProperty("time", System.currentTimeMillis());

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);
  }

  /** Retrieves and returns a list of comments from the Datastore database */
  private List<Comment> getCommentsFromDatabase() {
    Query query = new Query("Comment").addSort("time", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    List<Comment> comments = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      String name = (String) entity.getProperty("name");
      String content = (String) entity.getProperty("content");
      long time = (long) entity.getProperty("time");

      Comment comment = new Comment(name, content, time);
      comments.add(comment);
    }
    return comments;
  }

  /** Takes an object and returns a JSON (string) representation of it */
  private static String convertToJson(Object obj) {
    Gson gson = new Gson();
    String json = gson.toJson(obj);
    return json;
  }
  
}