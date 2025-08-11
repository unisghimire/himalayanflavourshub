import { supabase } from './supabase';

class ContentService {
  // Fetch content for a specific section
  async getSectionContent(sectionName) {
    try {
      const { data, error } = await supabase
        .from('landing_page_content')
        .select('content')
        .eq('section_name', sectionName)
        .single();

      if (error) {
        console.error(`Error fetching ${sectionName} content:`, error);
        return null;
      }

      return data.content;
    } catch (error) {
      console.error(`Error fetching ${sectionName} content:`, error);
      return null;
    }
  }

  // Fetch all sections content at once
  async getAllContent() {
    try {
      const { data, error } = await supabase
        .from('landing_page_content')
        .select('section_name, content');

      if (error) {
        console.error('Error fetching all content:', error);
        return {};
      }

      // Convert array to object with section names as keys
      const contentObject = {};
      data.forEach(item => {
        contentObject[item.section_name] = item.content;
      });

      return contentObject;
    } catch (error) {
      console.error('Error fetching all content:', error);
      return {};
    }
  }

  // Update content for a specific section (admin only)
  async updateSectionContent(sectionName, newContent) {
    try {
      const { data, error } = await supabase
        .from('landing_page_content')
        .update({ content: newContent })
        .eq('section_name', sectionName)
        .select();

      if (error) {
        console.error(`Error updating ${sectionName} content:`, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error updating ${sectionName} content:`, error);
      return false;
    }
  }
}

export const contentService = new ContentService();
