FactoryBot.modify do
  fixtures = Pageflow::LinkmapPage::Engine.root.join('spec', 'support', 'fixtures')

  factory :image_file do
    trait :not_yet_uploaded do
      attachment { nil }
      file_name { 'image.jpg' }
      state { 'uploading' }
    end

    trait :red_fixture do
      attachment { File.open(fixtures.join('red.png')) }
    end

    trait :color_map_fixture do
      attachment { File.open(fixtures.join('color_map.png')) }
    end

    trait :transparent_fixture do
      attachment { File.open(fixtures.join('transparent.png')) }
    end

    trait :dots_and_lines_fixture do
      attachment { File.open(fixtures.join('dots_and_lines.png')) }
    end

    trait :green_and_black_fixture do
      attachment { File.open(fixtures.join('green_and_black.png')) }
    end
  end
end
